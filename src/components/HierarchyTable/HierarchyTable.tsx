import { useDataContext } from "../../hooks/useDataContext";
import TableRow from "../TableRow/TableRow";

const HierarchyTable = () => {
    const { hierarchyData } = useDataContext();

    const mainHeaders =
        hierarchyData.length > 0 ? Object.keys(hierarchyData[0].data) : [];
    const allMainHeaders = [...mainHeaders, "delete"];

    return (
        <table className="w-full">
            <thead className="text-black">
                <tr>
                    {allMainHeaders.map((header) => (
                        <th
                            key={header}
                            className="p-2 border-b text-left bg-primary"
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
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
