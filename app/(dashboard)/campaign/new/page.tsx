"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Check, Plus } from "lucide-react";
import React, { useState } from "react";

const CreateNewCampaignPage = () => {
  const [activeStep] = useState(0);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const steps = [
    "Basic details",
    "Product and budget",
    "Recommendations",
    "Templates",
    "Review",
  ];

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white rounded-xl shadow-sm p-8 mt-28">
      <h1 className="text-2xl font-bold mb-8">Create new campaign</h1>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  index === activeStep
                    ? "bg-black text-white border-black"
                    : index < activeStep
                    ? "bg-white border-black text-black"
                    : "bg-white border-gray-300 text-gray-300"
                }`}
              >
                {index < activeStep ? (
                  <Check size={16} />
                ) : (
                  index === 0 && activeStep === 0 && <Check size={16} />
                )}
              </div>
              <span className="text-xs mt-2">{step}</span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-[2px] flex-1 mx-2 border-t-2 border-dashed ${
                  index < activeStep ? "border-black" : "border-gray-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Basic Details Form */}
      <div>
        <h2 className="font-semibold text-lg mb-6">Basic details</h2>

        {/* Influencer Location */}
        <div className="border rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-medium">Influencer location</h3>
              <p className="text-sm text-gray-500">
                Choose your influencer&lsquo;s location
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={locationEnabled}
                onCheckedChange={setLocationEnabled}
              />
              <div className="flex items-center gap-1">
                <span className="text-sm">Uganda</span>
                <span className="text-lg">🇺🇬</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm mb-1">State/City</label>
            <div className="relative">
              <select className="w-full p-2.5 border rounded-md appearance-none bg-white text-gray-500">
                <option>Select State/City</option>
                <option>Kampala</option>
                <option>Entebbe</option>
                <option>Jinja</option>
                <option>Mbarara</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Platforms */}
        <div className="mb-8">
          <h3 className="font-medium mb-4">Campaign platforms</h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1 px-3 py-2 border rounded-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 7.76501C9.63504 7.76501 7.76501 9.63504 7.76501 12C7.76501 14.3649 9.63504 16.235 12 16.235C14.3649 16.235 16.235 14.3649 16.235 12C16.235 9.63504 14.3649 7.76501 12 7.76501ZM12 15.0049C10.3451 15.0049 8.99513 13.6549 8.99513 12C8.99513 10.3451 10.3451 8.99513 12 8.99513C13.6549 8.99513 15.0049 10.3451 15.0049 12C15.0049 13.6549 13.6549 15.0049 12 15.0049Z"
                  fill="currentColor"
                />
                <path
                  d="M16.4561 8.4949C16.9414 8.4949 17.3345 8.10181 17.3345 7.61654C17.3345 7.13128 16.9414 6.73818 16.4561 6.73818C15.9709 6.73818 15.5778 7.13128 15.5778 7.61654C15.5778 8.10181 15.9709 8.4949 16.4561 8.4949Z"
                  fill="currentColor"
                />
                <path
                  d="M19.4517 6.7207C19.3951 5.56273 19.1942 5.06118 19.032 4.7061C18.801 4.19334 18.5101 3.80356 18.075 3.37207C17.6436 2.93705 17.25 2.642 16.7373 2.41445C16.3822 2.25226 15.8807 2.05129 14.7227 1.99472C13.4719 1.9325 13.0891 1.92188 12.0001 1.92188C10.9111 1.92188 10.5284 1.93179 9.27766 1.99399C8.11972 2.05056 7.61816 2.25153 7.26309 2.4137C6.75033 2.64447 6.36059 2.93541 5.92907 3.37047C5.49403 3.80188 5.1989 4.19545 4.97143 4.70819C4.80925 5.06328 4.60825 5.56484 4.55171 6.72278C4.48949 7.97358 4.47888 8.35632 4.47888 9.44534C4.47888 10.5344 4.48879 10.9171 4.55099 12.1678C4.60755 13.3258 4.80854 13.8273 4.9707 14.1824C5.20146 14.6952 5.49243 15.0849 5.92747 15.5164C6.35888 15.9515 6.75245 16.2466 7.26517 16.474C7.62027 16.6362 8.12182 16.8372 9.27978 16.8938C10.5305 16.956 10.9133 16.9667 12.0023 16.9667C13.0913 16.9667 13.474 16.9568 14.7247 16.8945C15.8827 16.8379 16.3842 16.637 16.7393 16.4748C17.252 16.244 17.6418 15.9531 18.0733 15.5181C18.5084 15.0867 18.8035 14.6931 19.0311 14.1804C19.1933 13.8253 19.3942 13.3238 19.4508 12.1658C19.513 10.9151 19.5236 10.5323 19.5236 9.44333C19.5236 8.35431 19.5139 7.97165 19.4517 6.7207ZM18.2121 12.0821C18.1598 13.1368 17.9675 13.5137 17.8322 13.7633C17.6717 14.0771 17.4642 14.3033 17.16 14.6058C16.8575 14.9083 16.6295 15.1174 16.3157 15.2779C16.0662 15.4132 15.6893 15.6055 14.6347 15.6578C13.3989 15.7185 13.0444 15.7281 11.9989 15.7281C10.9534 15.7281 10.5973 15.7185 9.36302 15.6578C8.30833 15.6055 7.93149 15.4132 7.68198 15.2779C7.36819 15.1174 7.14206 14.9099 6.83955 14.6058C6.53704 14.3033 6.32797 14.0752 6.16748 13.7615C6.03223 13.5119 5.83983 13.135 5.7875 12.0804C5.7268 10.8447 5.71716 10.4901 5.71716 9.44463C5.71716 8.3991 5.7268 8.043 5.7875 6.80878C5.83983 5.75413 6.03223 5.37729 6.16748 5.12776C6.32797 4.81397 6.53551 4.58784 6.83955 4.28533C7.14206 3.98282 7.37023 3.77374 7.68396 3.61326C7.93347 3.47799 8.31032 3.28561 9.36499 3.23326C10.6007 3.17256 10.9553 3.16293 12.0008 3.16293C13.0481 3.16293 13.4024 3.17256 14.6367 3.23326C15.6913 3.28561 16.0682 3.47799 16.3177 3.61326C16.6315 3.77374 16.8576 3.98135 17.16 4.28533C17.4625 4.58784 17.6717 4.81595 17.8322 5.12776C17.9675 5.37729 18.1598 5.75413 18.2121 6.80878C18.2728 8.04451 18.2825 8.3991 18.2825 9.44463C18.2825 10.4901 18.2728 10.8429 18.2121 12.0821Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm">Instagram</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 border rounded-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm">Facebook</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 border rounded-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.59 6.69C19.4649 6.31949 19.2547 5.98644 18.98 5.71C18.7021 5.43293 18.3674 5.22321 18 5.1C16.61 4.73 12 4.73 12 4.73C12 4.73 7.39 4.73 6 5.1C5.63261 5.22321 5.29792 5.43293 5.02 5.71C4.74534 5.98644 4.53506 6.31949 4.41 6.69C4.14518 8.06345 4.01249 9.46183 4.01 10.865C4.01181 12.2634 4.14451 13.657 4.41 15.025C4.53506 15.3945 4.74534 15.7276 5.02 16.004C5.29792 16.2811 5.63261 16.4908 6 16.614C7.39 16.984 12 16.984 12 16.984C12 16.984 16.61 16.984 18 16.614C18.3674 16.4908 18.7021 16.2811 18.98 16.004C19.2547 15.7276 19.4649 15.3945 19.59 15.025C19.8548 13.657 19.9875 12.2634 19.99 10.865C19.9875 9.46183 19.8548 8.06345 19.59 6.69ZM10.17 13.395V8.33C10.1693 8.25968 10.1884 8.19104 10.2248 8.13172C10.2612 8.0724 10.3134 8.02539 10.375 7.997C10.4366 7.96861 10.5051 7.9603 10.571 7.97294C10.6368 7.98558 10.6969 8.01853 10.744 8.066L14.337 10.598C14.3839 10.6449 14.4204 10.7022 14.4435 10.7654C14.4665 10.8287 14.4754 10.8963 14.4696 10.9635C14.4638 11.0306 14.4435 11.0954 14.4099 11.1526C14.3763 11.2098 14.3304 11.2579 14.276 11.293L10.684 13.676C10.6301 13.7114 10.5681 13.7336 10.5038 13.7406C10.4395 13.7476 10.3749 13.7393 10.3156 13.7163C10.2564 13.6933 10.2045 13.6564 10.1653 13.6092C10.1261 13.562 10.1008 13.5062 10.092 13.447L10.17 13.395Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm">TikTok</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 border rounded-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.543 6.498C22 8.28 22 12 22 12C22 12 22 15.72 21.543 17.502C21.289 18.487 20.546 19.262 19.605 19.524C17.896 20 12 20 12 20C12 20 6.107 20 4.395 19.524C3.45 19.258 2.708 18.484 2.457 17.502C2 15.72 2 12 2 12C2 12 2 8.28 2.457 6.498C2.711 5.513 3.454 4.738 4.395 4.476C6.107 4 12 4 12 4C12 4 17.896 4 19.605 4.476C20.55 4.742 21.292 5.516 21.543 6.498ZM10 15.5L16 12L10 8.5V15.5Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm">YouTube</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 border rounded-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.244 2.25H21.552L14.325 10.51L22.823 21.75H16.195L10.982 14.933L4.91499 21.75H1.60699L9.37599 12.893L1.28999 2.25H8.06399L12.744 8.516L18.244 2.25ZM17.064 19.77H18.895L7.10999 4.126H5.16399L17.064 19.77Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm">Twitter</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 border rounded-full">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V10L14 3ZM5 5H12V12H19V19H5V5ZM7 13V15H17V13H7ZM7 17V19H14V17H7Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm">Blog</span>
            </div>
            <button className="flex items-center gap-1 px-3 py-2 bg-black text-white rounded-full">
              <Plus size={16} />
              <span className="text-sm">Add</span>
            </button>
          </div>
        </div>

        {/* Campaign Targets */}
        <div className="mb-8">
          <h3 className="font-medium mb-2">Campaign targets</h3>
          <p className="text-sm text-gray-500 mb-6">
            By setting clear and measurable targets, you track the performance
            of your campaign and optimize your strategy to achieve the best
            possible results.
          </p>

          <div className="grid grid-cols-4 gap-4">
            {/* Awareness */}
            <div className="border rounded-lg p-5">
              <h4 className="font-medium mb-4">Awareness</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brand-awareness"
                    className="bg-blue-500 text-white"
                    defaultChecked
                  />
                  <label htmlFor="brand-awareness" className="text-sm">
                    Brand awareness
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reach"
                    className="bg-blue-500 text-white"
                    defaultChecked
                  />
                  <label htmlFor="reach" className="text-sm">
                    Reach
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="barter" />
                  <label htmlFor="barter" className="text-sm">
                    Barter
                  </label>
                </div>
              </div>
            </div>

            {/* Advocacy */}
            <div className="border rounded-lg p-5">
              <h4 className="font-medium mb-4">Advocacy</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="traffic"
                    className="bg-blue-500 text-white"
                    defaultChecked
                  />
                  <label htmlFor="traffic" className="text-sm">
                    Traffic
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="engagement"
                    className="bg-blue-500 text-white"
                    defaultChecked
                  />
                  <label htmlFor="engagement" className="text-sm">
                    Engagement
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="app-installs" />
                  <label htmlFor="app-installs" className="text-sm">
                    App installs
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="video-views" />
                  <label htmlFor="video-views" className="text-sm">
                    Videos Views
                  </label>
                </div>
              </div>
            </div>

            {/* Conversions */}
            <div className="border rounded-lg p-5">
              <h4 className="font-medium mb-4">Conversions</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="conversions" />
                  <label htmlFor="conversions" className="text-sm">
                    Conversions
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="catalog-sales" />
                  <label htmlFor="catalog-sales" className="text-sm">
                    Catalog Sales
                  </label>
                </div>
              </div>
            </div>

            {/* Content Type */}
            <div className="border rounded-lg p-5">
              <h4 className="font-medium mb-4">Content Type</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="creation-posting" />
                  <label htmlFor="creation-posting" className="text-sm">
                    Creation + Posting
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="creation-only" />
                  <label htmlFor="creation-only" className="text-sm">
                    Creation Only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="posting-only" />
                  <label htmlFor="posting-only" className="text-sm">
                    Posting only
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Influencers */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-medium">
            Select to add influencers to your campaigns
          </h3>
          <button className="flex items-center gap-1 px-3 py-2 bg-black text-white rounded-full">
            <Plus size={16} />
            <span className="text-sm">Add</span>
          </button>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewCampaignPage;
