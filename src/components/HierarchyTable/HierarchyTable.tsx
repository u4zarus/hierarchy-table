import { useDataContext } from "../../hooks/useDataContext";
import TableRow from "../TableRow/TableRow";

/**
 * A component that renders a table with the hierarchyData from the DataContext.
 * The table has a fixed layout and displays all the data in the hierarchyData
 * array. The headers are defined in the headers const above.
 *
 * @returns {JSX.Element} The rendered table component.
 */
const HierarchyTable = () => {
    const { hierarchyData, headers } = useDataContext();

    const allMainHeaders = [...headers, "delete"];

    return (
        <table className="w-full table-fixed">
            <thead className="text-black">
                <tr>
                    <th className="p-2 border-b bg-primary"></th>
                    {allMainHeaders.map((header) => (
                        <th key={header} className="p-2 border-b bg-primary">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {hierarchyData.length > 0 &&
                    hierarchyData.map((item, index) => (
                        <TableRow
                            key={`${String(item.data.ID)}-${index}`}
                            item={item}
                        />
                    ))}
                {hierarchyData.length === 0 && (
                    <tr>
                        <td
                            colSpan={allMainHeaders.length + 1}
                            className="p-2 text-center"
                        >
                            No data available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default HierarchyTable;
