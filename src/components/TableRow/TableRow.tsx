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

    const hasChildren =
        item.children &&
        Object.values(item.children).some(
            (childGroup) => childGroup.records.length > 0
        );

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        removeItem(item.data.ID as string, item);
    };

    const icon = hasChildren ? (isExpanded ? "▼" : "►") : "";
    const allKeys = Object.keys(item.data);

    return (
        <>
            <tr
                className="cursor-pointer hover:bg-gray-100"
                onClick={hasChildren ? toggleExpand : undefined}
                style={{
                    backgroundColor: depth > 0 ? "#f9fafb" : "transparent",
                }}
            >
                {allKeys.map((key, index) => {
                    const value = item.data[key];
                    const isFirstCell = index === 0;

                    return (
                        <td
                            key={`${key}-${String(item.data.ID)}`} // Avoiding duplicate ID (48)
                            className="py-2 border-b"
                            style={{
                                paddingLeft: isFirstCell
                                    ? `${depth * 20 + 8}px`
                                    : "8px",
                            }}
                        >
                            {isFirstCell && (
                                <span className="mr-2">{icon}</span>
                            )}
                            {String(value)}
                        </td>
                    );
                })}
                <td className="py-2 border-b">
                    <button onClick={handleDelete} className="cursor-pointer">
                        ❌
                    </button>
                </td>
            </tr>

            {/* Recursively render child rows if expanded */}
            {isExpanded &&
                hasChildren &&
                Object.values(item.children).map((childGroup, groupIndex) => {
                    const childHeaders =
                        childGroup.records.length > 0
                            ? Object.keys(childGroup.records[0].data)
                            : [];
                    const allChildHeaders = [...childHeaders, "delete"];

                    return (
                        <>
                            {/* Nested headers */}
                            <tr
                                key={`child-headers-${String(
                                    item.data.ID
                                )}-${groupIndex}`}
                                className="bg-gray-100"
                            >
                                {allChildHeaders.map((header) => (
                                    <th
                                        key={header}
                                        className="p-2 border-b text-center"
                                        style={{
                                            paddingLeft:
                                                header === allChildHeaders[0]
                                                    ? `${
                                                          (depth + 1) * 20 + 8
                                                      }px`
                                                    : "8px",
                                        }}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                            {/* Child row */}
                            {childGroup.records.map((childItem, childIndex) => (
                                <TableRow
                                    key={`${String(item.data.ID)}-${String(
                                        childItem.data.ID
                                    )}-${childIndex}`}
                                    item={childItem}
                                    depth={depth + 1}
                                />
                            ))}
                        </>
                    );
                })}
        </>
    );
};

export default TableRow;
