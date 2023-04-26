import { useContext } from "react";
import MetaContext from "./MetaContext";

const useMeta = () => useContext(MetaContext);

export default useMeta;