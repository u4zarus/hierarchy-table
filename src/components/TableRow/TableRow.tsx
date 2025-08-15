import { useState } from "react";
import type { HierarchyNode } from "../../context/types";
import { useDataContext } from "../../hooks/useDataContext";
import ChildTable from "../ChildTable/ChildTable";

interface TableRowProps {
    item: HierarchyNode;
}

/**
 * Renders a table row component that displays data from a HierarchyNode object.
 * Optionally displays child data in a child table.
 *
 * @param {TableRowProps} props - The props object containing the item to display.
 * @param {HierarchyNode} props.item - The HierarchyNode object containing the data to display.
 * @return {JSX.Element} The table row component.
 */
const TableRow = ({ item }: TableRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { removeItem } = useDataContext();

    const hasChildren = item.children
        ? Object.values(item.children).some(
              (childGroup) => childGroup.records.length > 0
          )
        : false;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        removeItem(item);
    };

    const allKeys = Object.keys(item.data);

    return (
        <>
            <tr
                className="cursor-pointer hover:bg-gray-900 odd:bg-surface-dark even:bg-surface-darker"
                onClick={hasChildren ? toggleExpand : undefined}
            >
                {/* Expand icon column */}
                <td className="py-2 border-b">
                    {hasChildren && (
                        <span className="cursor-pointer">
                            {isExpanded ? "▼" : "►"}
                        </span>
                    )}
                </td>

                {/* Data columns */}
                {allKeys.map((key) => {
                    const value = item.data[key];
                    return (
                        <td key={key} className="py-2 border-b px-2">
                            {String(value)}
                        </td>
                    );
                })}

                {/* Delete button column */}
                <td className="py-2 border-b text-center">
                    <button onClick={handleDelete} className="cursor-pointer">
                        ❌
                    </button>
                </td>
            </tr>

            {isExpanded && hasChildren && (
                <ChildTable childrenData={item.children} />
            )}
        </>
    );
};

export default TableRow;
