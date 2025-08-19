import React from "react";
import type { HierarchyNode } from "../../context/types";
import TableRow from "../TableRow/TableRow";

interface ChildTableProps {
    childrenData: HierarchyNode["children"];
}

/**
 * Renders a table to display the children data of a parent node.
 *
 * This component takes in a `childrenData` prop, which is an object containing
 * the children data of a parent node. The component maps over the children data
 * and renders a table row for each child item. The table headers are dynamically
 * generated based on the keys of the child data.
 *
 * @param {ChildTableProps} props - The props object containing the children data.
 * @param {HierarchyNode["children"]} props.childrenData - The children data to display.
 * @return {JSX.Element} The rendered table component.
 */
const ChildTable = ({ childrenData }: ChildTableProps) => {
    if (!childrenData) {
        return null;
    }

    return (
        <>
            {Object.values(childrenData).map((childGroup, groupIndex) => {
                const childHeaders =
                    childGroup.records.length > 0
                        ? Object.keys(childGroup.records[0].data)
                        : [];

                const allChildHeaders = [...childHeaders, "delete"];

                return (
                    <React.Fragment key={`group-${groupIndex}`}>
                        <tr className="bg-primary text-black">
                            <th className="p-2 border-y bg-primary"></th>
                            {allChildHeaders.map((header) => (
                                <th key={header} className="p-2 border-y">
                                    {header}
                                </th>
                            ))}
                        </tr>

                        {childGroup.records.map((childItem, childIndex) => (
                            <TableRow
                                key={`child-${childItem.data.ID}-${childIndex}`}
                                item={childItem}
                            />
                        ))}
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default ChildTable;
