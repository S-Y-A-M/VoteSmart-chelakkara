import { RoadmapContainer } from "./components/RoadmapContainer";
import electionData from "./data/electionData.json";
import type { ElectionData } from "./types";

const data = electionData as ElectionData;

export default function App() {
  return <RoadmapContainer data={data} />;
}
