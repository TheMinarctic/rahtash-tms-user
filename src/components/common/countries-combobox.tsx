import { Combobox } from "../ui/combobox";
import { countries } from "@/data/countries";

interface Props {
  value: number;
  onChange: (val: number) => void;
}

const CountriesCombobox = ({ onChange, value }: Props) => {
  return (
    <Combobox
      value={value}
      onValueChange={onChange}
      items={countries.map((item) => ({ name: item.label, value: item.value }))}
    />
  );
};

export default CountriesCombobox;
