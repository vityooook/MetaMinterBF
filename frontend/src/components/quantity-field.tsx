import { useState } from "react";
import { Button } from "./ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Input } from "./ui/input";

interface QuantityFieldProps {
  nftPrice: number;
  onQuantityChange?: (quantity: number) => void;
}

export const QuantityField: React.FC<QuantityFieldProps> = ({
  onQuantityChange,
  nftPrice,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
      onQuantityChange?.(value);
    }
  };

  return (
    <>
      <div className="flex items-center px-20 gap-2">
        <Button
          onClick={handleDecrement}
          size="icon"
          variant="ghost"
          className="bg-card min-w-10"
          disabled={quantity <= 1}
        >
          <MinusIcon className="w-5 h-5" />
        </Button>
        <div className="flex items-center flex-col gap-1">
          <Input
            onChange={handleInputChange}
            value={quantity}
            type="input"
            pattern="\d*"
            className="bg-transparent border-none text-4xl text-center"
            min={1}
          />
          <span className="text-muted-foreground">
            {(nftPrice * quantity).toFixed(2)} TON
          </span>
        </div>
        <Button
          onClick={handleIncrement}
          size="icon"
          variant="ghost"
          className="bg-card min-w-10"
        >
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>
    </>
  );
};
