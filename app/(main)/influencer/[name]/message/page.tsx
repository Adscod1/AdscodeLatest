"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  AlignLeft,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Paperclip,
  Image as ImageIcon,
  List,
  Code,
  Clock,
} from "lucide-react";
import Link from "next/link";

const SendMessage = () => {
  const [messageContent, setMessageContent] = useState(`
• Timeline for full delivery: 3-4 weeks (branding), ongoing (marketing)
• All designs are original and delivered in editable formats
• Prices include materials, production, and setup where applicable
• Pricing can be adjusted slightly depending on client preferences and scope

• Timeline for full delivery: 3-4 weeks (branding), ongoing (marketing)
• All designs are original and delivered in editable formats
• Prices include materials, production, and setup where applicable
• Pricing can be adjusted slightly depending on client preferences and scope
`);

  return (
    <div className="mx-auto max-w-4xl my-8 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">New Message</h3>
        </div>
        <Link
          href="/influencer/all"
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </Link>
      </div>

      {/* Message Form */}
      <div className="bg-white">
        {/* Recipient */}
        <div className="flex p-4 border-b">
          <div className="w-20 text-gray-500 font-medium">To:</div>
          <div className="flex-1">
            <input
              type="text"
              className="w-full focus:outline-none"
              value="Ignatious Kwatempora"
              readOnly
            />
          </div>
        </div>

        {/* Subject */}
        <div className="p-4 border-b">
          <input
            type="text"
            className="w-full focus:outline-none font-semibold"
            value="RE: AGREEMENT ACCEPTANCE LETTER"
            onChange={() => {}}
            placeholder="Subject"
          />
        </div>

        {/* Message Body */}
        <div className="p-4 min-h-[300px]">
          <textarea
            className="w-full h-full min-h-[300px] focus:outline-none resize-none whitespace-pre-wrap"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
        </div>

        {/* Formatting Tools */}
        <div className="flex items-center p-2 border-t space-x-1">
          <button className="p-2 rounded hover:bg-gray-100">
            <AlignLeft size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <Bold size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <Italic size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <Underline size={16} />
          </button>
          <span className="mx-2 text-gray-300">|</span>
          <button className="p-2 rounded hover:bg-gray-100 text-rose-500">
            <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
          </button>
          <span className="mx-2 text-gray-300">|</span>
          <button className="p-2 rounded hover:bg-gray-100">
            <LinkIcon size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <Paperclip size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <ImageIcon size={16} />
          </button>
          <span className="mx-2 text-gray-300">|</span>
          <button className="p-2 rounded hover:bg-gray-100">
            <List size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <Code size={16} />
          </button>
          <div className="flex-1"></div>
          <select className="bg-white border rounded px-2 py-1 text-sm">
            <option>12</option>
            <option>14</option>
            <option>16</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between p-4 bg-white border-t">
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded"
        >
          <X size={16} />
          Discard
        </Button>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded"
          >
            <Clock size={16} />
            Send Later
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
