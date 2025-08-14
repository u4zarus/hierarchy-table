import { useState } from "react";
import type { HierarchyNode } from "../../context/types";
import { useDataContext } from "../../hooks/useDataContext";

interface TableRowProps {
    item: HierarchyNode;
    depth: number;
}

const TableRow = ({ item, depth }: TableRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { removeItem } = useDataContext();

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDelete = () => {
        removeItem(item.data.ID as string, item);
    };

    return (
        <>
            <tr
                style={{ paddingLeft: `${depth * 20}px` }}
                onClick={toggleExpand}
            >
                <td>
                    {Object.entries(item.data).map(([key, value]) => (
                        <span key={key}>: {value}</span>
                    ))}
                </td>
                <td>
                    <button onClick={handleDelete}>❌</button>
                </td>
            </tr>
            {isExpanded &&
                item.children &&
                Object.values(item.children).map((childGroup) =>
                    childGroup.records.map((childItem) => (
                        <TableRow
                            key={String(childItem.data.ID)}
                            item={childItem}
                            depth={depth + 1}
                        />
                    ))
                )}
        </>
    );
};

export default TableRow;
