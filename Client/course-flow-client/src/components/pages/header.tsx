import { useState, type FunctionComponent } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { AiFillBell, AiFillTrophy } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";

interface HeaderPageProps {}

const items = [
  "React",
  "Next.js",
  "Tailwind",
  "Shadcn",
  "JavaScript",
  "TypeScript",
];

const HeaderPage: FunctionComponent<HeaderPageProps> = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <header className=" relative w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 py-3 ">
      <div className="w-full md:w-auto ">
        <Command className="border rounded-[20px] overflow-clip bg-[#F3F1EF] opacity-70 w-full md:w-80">
          <CommandInput
            placeholder="Tìm kiếm..."
            value={search}
            onValueChange={setSearch}
          />
          {search && (
            <CommandList className="absolute top-full z-50 w-full bg-white border shadow-md mt-1 rounded-md">
              <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item}
                  onSelect={() => {
                    setSelected(item);
                    setSearch(item);
                  }}
                >
                  {item}
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
        {selected && (
          <p className="mt-2 text-sm text-muted-foreground">
            Đã chọn: <strong>{selected}</strong>
          </p>
        )}
      </div>

      <div className="flex items-center justify-between max-md:hidden gap-4">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="hidden sm:inline">1024 Trophy</span>
          <AiFillTrophy className="text-orange-400" />
        </div>
        <AiFillBell className="text-xl" />
        <Badge className="py-2 px-3 text-xs sm:text-sm">Join Bootcamp</Badge>
      </div>
    </header>
  );
};

export default HeaderPage;
