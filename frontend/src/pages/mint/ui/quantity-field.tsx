import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Input } from "../../../components/ui/input";

interface QuantityFieldProps {
  nftPrice: number;
  onQuantityChange?: (quantity: number) => void; // Added optional onChange prop
}

export const QuantityField: React.FC<QuantityFieldProps> = ({
  onQuantityChange,
  nftPrice,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity); // Call onChange if provided
    }
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity); // Call onChange if provided
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
      onQuantityChange?.(value); // Call onChange if provided
    }
  };

  return (
    <>
      <div className="flex items-center px-20 gap-2">
        <Button
          onClick={handleDecrement}
          size="icon"
          variant="ghost"
          className=" bg-card min-w-10"
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
            min={0} // Ensure that input cannot go below 0
          />
          <span className="text-muted-foreground">
            {nftPrice * quantity} TON
          </span>
        </div>
        <Button
          onClick={handleIncrement}
          size="icon"
          variant="ghost"
          className=" bg-card min-w-10"
        >
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>
    </>
  );
};
