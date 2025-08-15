import { useState } from "react";
import type { HierarchyNode } from "../../context/types";
import { useDataContext } from "../../hooks/useDataContext";
import React from "react";

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

    const allKeys = Object.keys(item.data);

    return (
        <>
            <tr
                className="cursor-pointer hover:bg-gray-900 odd:bg-surface-dark even:bg-surface-darker"
                onClick={hasChildren ? toggleExpand : undefined}
            >
                {/* Icon column */}
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
                        <td
                            key={`${key}-${String(item.data.ID)}`}
                            className="py-2 border-b px-2"
                        >
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
                        <React.Fragment
                            key={`group-${item.data.ID}-${groupIndex}`}
                        >
                            {/* Nested headers */}
                            <tr
                                key={`child-headers-${String(
                                    item.data.ID
                                )}-${groupIndex}`}
                                className="bg-primary text-black"
                            >
                                <th className="p-2 border-b bg-primary"></th>
                                {allChildHeaders.map((header) => (
                                    <th key={header} className="p-2 border-b">
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
                        </React.Fragment>
                    );
                })}
        </>
    );
};

export default TableRow;
