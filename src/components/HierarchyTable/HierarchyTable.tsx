import { useDataContext } from "../../hooks/useDataContext";
import TableRow from "../TableRow/TableRow";

const HierarchyTable = () => {
    const { hierarchyData } = useDataContext();

    return (
        <table className="w-full">
            <thead></thead>
            <tbody>
                {hierarchyData.map((item, index) => (
                    <TableRow
                        key={`${String(item.data.ID)}-${index}`}
                        item={item}
                        depth={0}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default HierarchyTable;
