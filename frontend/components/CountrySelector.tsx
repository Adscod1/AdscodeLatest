"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CountryOption = { value: string; label: string };

// African countries (kept as a dedicated group)
const africanCountries: CountryOption[] = [
  { value: "algeria", label: "Algeria" },
  { value: "angola", label: "Angola" },
  { value: "benin", label: "Benin" },
  { value: "botswana", label: "Botswana" },
  { value: "burkina-faso", label: "Burkina Faso" },
  { value: "burundi", label: "Burundi" },
  { value: "cabo-verde", label: "Cabo Verde" },
  { value: "cameroon", label: "Cameroon" },
  { value: "central-african-republic", label: "Central African Republic" },
  { value: "chad", label: "Chad" },
  { value: "comoros", label: "Comoros" },
  { value: "congo-brazzaville", label: "Congo (Brazzaville)" },
  { value: "congo-kinshasa", label: "Congo (Kinshasa)" },
  { value: "cote-divoire", label: "Côte d'Ivoire" },
  { value: "djibouti", label: "Djibouti" },
  { value: "egypt", label: "Egypt" },
  { value: "equatorial-guinea", label: "Equatorial Guinea" },
  { value: "eritrea", label: "Eritrea" },
  { value: "eswatini", label: "Eswatini" },
  { value: "ethiopia", label: "Ethiopia" },
  { value: "gabon", label: "Gabon" },
  { value: "gambia", label: "Gambia" },
  { value: "ghana", label: "Ghana" },
  { value: "guinea", label: "Guinea" },
  { value: "guinea-bissau", label: "Guinea-Bissau" },
  { value: "kenya", label: "Kenya" },
  { value: "lesotho", label: "Lesotho" },
  { value: "liberia", label: "Liberia" },
  { value: "libya", label: "Libya" },
  { value: "madagascar", label: "Madagascar" },
  { value: "malawi", label: "Malawi" },
  { value: "mali", label: "Mali" },
  { value: "mauritania", label: "Mauritania" },
  { value: "mauritius", label: "Mauritius" },
  { value: "morocco", label: "Morocco" },
  { value: "mozambique", label: "Mozambique" },
  { value: "namibia", label: "Namibia" },
  { value: "niger", label: "Niger" },
  { value: "nigeria", label: "Nigeria" },
  { value: "rwanda", label: "Rwanda" },
  { value: "sao-tome-and-principe", label: "São Tomé and Príncipe" },
  { value: "senegal", label: "Senegal" },
  { value: "seychelles", label: "Seychelles" },
  { value: "sierra-leone", label: "Sierra Leone" },
  { value: "somalia", label: "Somalia" },
  { value: "south-africa", label: "South Africa" },
  { value: "south-sudan", label: "South Sudan" },
  { value: "sudan", label: "Sudan" },
  { value: "tanzania", label: "Tanzania" },
  { value: "togo", label: "Togo" },
  { value: "tunisia", label: "Tunisia" },
  { value: "uganda", label: "Uganda" },
  { value: "zambia", label: "Zambia" },
  { value: "zimbabwe", label: "Zimbabwe" },
];

// Common global countries (so users outside Africa can still pick quickly)
// If you'd like, we can switch this to the full ISO-3166 list later.
const globalCountries: CountryOption[] = [
  // North America
  { value: "canada", label: "Canada" },
  { value: "mexico", label: "Mexico" },
  { value: "united-states", label: "United States" },

  // South America
  { value: "argentina", label: "Argentina" },
  { value: "brazil", label: "Brazil" },
  { value: "chile", label: "Chile" },
  { value: "colombia", label: "Colombia" },
  { value: "peru", label: "Peru" },

  // Europe
  { value: "france", label: "France" },
  { value: "germany", label: "Germany" },
  { value: "ireland", label: "Ireland" },
  { value: "italy", label: "Italy" },
  { value: "netherlands", label: "Netherlands" },
  { value: "norway", label: "Norway" },
  { value: "poland", label: "Poland" },
  { value: "portugal", label: "Portugal" },
  { value: "spain", label: "Spain" },
  { value: "sweden", label: "Sweden" },
  { value: "switzerland", label: "Switzerland" },
  { value: "united-kingdom", label: "United Kingdom" },

  // Middle East
  { value: "israel", label: "Israel" },
  { value: "saudi-arabia", label: "Saudi Arabia" },
  { value: "united-arab-emirates", label: "United Arab Emirates" },

  // Asia
  { value: "china", label: "China" },
  { value: "india", label: "India" },
  { value: "indonesia", label: "Indonesia" },
  { value: "japan", label: "Japan" },
  { value: "malaysia", label: "Malaysia" },
  { value: "pakistan", label: "Pakistan" },
  { value: "philippines", label: "Philippines" },
  { value: "singapore", label: "Singapore" },
  { value: "south-korea", label: "South Korea" },
  { value: "thailand", label: "Thailand" },
  { value: "vietnam", label: "Vietnam" },

  // Oceania
  { value: "australia", label: "Australia" },
  { value: "new-zealand", label: "New Zealand" },
];

interface CountrySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function CountrySelector({
  value,
  onValueChange,
  placeholder = "Select country",
}: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedCountry = [...africanCountries, ...globalCountries].find(
    (country) => country.value === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCountry ? selectedCountry.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        side="bottom"
        sideOffset={0}
      >
        <Command className="rounded-md">
          <CommandInput className="rounded-none" placeholder="Search country..." />
          <CommandList className="max-h-72">
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup heading="Africa">
              {africanCountries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.label}
                  onSelect={() => {
                    onValueChange(country.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {country.label}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Other countries">
              {globalCountries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.label}
                  onSelect={() => {
                    onValueChange(country.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {country.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
