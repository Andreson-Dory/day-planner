import React from "react";
import StatusButton from "../button/StatusButton";
import Row from "../row";

type Props = {
  filter: "All" | "Pending" | "Completed";
  setFilter: React.Dispatch<React.SetStateAction<"Completed" | "All" | "Pending">>;
};

export default function StatusHeader({ filter, setFilter }: Props) {
  const handleClickAll = () => {
    setFilter("All");
  };

  const handleClickPending = () => {
    setFilter("Pending");
  };

  const handleClickCompleted = () => {
    setFilter("Completed");
  };

  return (
    <Row className="mx-2.5">
      <StatusButton type="All" filter={filter} onPress={handleClickAll} />
      <StatusButton type="Pending" filter={filter} onPress={handleClickPending} />
      <StatusButton type="Completed" filter={filter} onPress={handleClickCompleted} />
    </Row>
  );
}
