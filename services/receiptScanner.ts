import { ReceiptItem } from "@/store/useStore";
import OpenAI from "openai";

// Initialize OpenAI - you'll need to set your API key in environment variables
const apiKey = process.env.EXPO_PUBLIC_OPEN_AI_KEY;

const openai = apiKey
  ? new OpenAI({
      apiKey: apiKey,
    })
  : null;

export interface ReceiptScanResult {
  items: ReceiptItem[];
  total?: number;
  merchant?: string;
  date?: string;
}

export async function scanReceiptWithOpenAI(
  imageUri: string
): Promise<ReceiptScanResult> {
  try {
    if (!openai) {
      throw new Error("OpenAI API key not configured");
    }

    // Convert the image to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.readAsDataURL(blob);
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1", // or "gpt-4-vision-preview"
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze this receipt image and extract the following information in JSON format:
              
              {
                "items": [
                  {
                    "id": "unique_id",
                    "name": "item_name",
                    "price": 0.00,
                    "quantity": 1
                  }
                ],
                "total": 0.00,
                "merchant": "store_name",
                "date": "YYYY-MM-DD"
              }
              
              Rules:
              - Extract all line items with their names and prices
              - Generate unique IDs for each item (use item name + index)
              - If quantity is not specified, assume 1
              - Prices should be numbers (not strings)
              - Return only the JSON object, no other text, no indication that it's JSON; just the JSON itself, starting with { and ending with }
              - Please take into account positive and negative prices (e.g., refunds or discounts or exchanges)
              - Please take sometimes receipts right hand column is the total price including the amount of the items. Look for the price of the INDIVIDUAL items, not the total.
              - If you can't read the receipt clearly, return an empty items array`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    console.log("content", content.trim());

    // Parse the JSON response
    const result = JSON.parse(content.trim());

    // Generate unique IDs if not provided
    if (result.items) {
      result.items = result.items.map((item: any, index: number) => ({
        ...item,
        id:
          item.id || `${item.name.replace(/\s+/g, "_").toLowerCase()}_${index}`,
        quantity: item.quantity || 1,
      }));
    }

    return result;
  } catch (error) {
    console.error("OpenAI receipt scan error:", error);
    throw new Error("Failed to scan receipt. Please try again.");
  }
}

// Fallback mock function for testing without API key
export function mockReceiptScan(): ReceiptScanResult {
  return {
    items: [
      {
        id: "coffee_1",
        name: "Latte",
        price: 4.5,
        quantity: 1,
      },
      {
        id: "sandwich_1",
        name: "Turkey Sandwich",
        price: 8.95,
        quantity: 1,
      },
      {
        id: "chips_1",
        name: "Potato Chips",
        price: 2.25,
        quantity: 1,
      },
    ],
    total: 15.7,
    merchant: "Cafe Example",
    date: new Date().toISOString().split("T")[0],
  };
}
