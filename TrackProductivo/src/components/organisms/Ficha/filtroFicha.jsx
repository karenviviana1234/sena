import React from "react";
import { Input } from "@nextui-org/react";
import { Search } from 'lucide-react';

export default function Filter({ filterValue, setFilterValue }) {
  const onSearchChange = (value) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  };

  const onClear = () => {
    setFilterValue("");
  };

  return (
    <Input
      isClearable
      className="w-full sm:max-w-[44%]"
      placeholder="Search by code or sede..."
      startContent={<Search />}
      value={filterValue}
      onClear={onClear}
      onValueChange={onSearchChange}
    />
  );
}
