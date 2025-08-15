import { useDataContext } from "../../hooks/useDataContext";
import TableRow from "../TableRow/TableRow";

const headers = [
    "ID",
    "Name",
    "Gender",
    "Ability",
    "Minimal distance",
    "Weight",
    "Born",
    "In space since",
    "Beer consumption (l/y)",
    "Knows the answer?",
]; // Explicitely defined so the headers don't disappear when the table is empty

/**
 * Renders a table to display the hierarchy data.
 *
 * This component uses the `useDataContext` hook to get the `hierarchyData`
 * from the context. It then creates the table headers and rows based on the
 * `hierarchyData`. The table is displayed with fixed width and scrollable
 * content.
 *
 * @return {JSX.Element} The rendered table component.
 */
const HierarchyTable = () => {
    const { hierarchyData } = useDataContext();

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
            </tbody>
        </table>
    );
};

export default HierarchyTable;
