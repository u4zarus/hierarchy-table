import { createContext, useEffect, useState, type ReactNode } from "react";
import type { HierarchyNode } from "./types";

interface DataContextType {
    hierarchyData: HierarchyNode[];
    removeItem: (node: HierarchyNode) => void;
}

interface DataProviderProps {
    children: ReactNode;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * A context provider that fetches data and provides it via context.
 *
 * @param {ReactNode} children - The child components to render.
 * @return {JSX.Element} The child components wrapped in a context provider.
 */
export const DataProvider = ({ children }: DataProviderProps) => {
    const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "/src/assets/data/example-data.json"
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data: HierarchyNode[] = await response.json();
                setHierarchyData(data);
            } catch (error) {
                setError("Error fetching data");
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    /**
     * Recursively removes a node from a nested array of HierarchyNode objects.
     *
     * @param {HierarchyNode[]} items - The array of HierarchyNode objects to search through.
     * @param {HierarchyNode} nodeToRemove - The node to remove from the array.
     * @return {HierarchyNode[]} A new array with the nodeToRemove removed.
     */
    const removeRecursive = (
        items: HierarchyNode[],
        nodeToRemove: HierarchyNode // Changed to accept node
    ): HierarchyNode[] => {
        return items
            .filter((item) => item !== nodeToRemove) // Compare by reference
            .map((item) => {
                if (item.children) {
                    const newChildren = Object.entries(item.children).reduce(
                        (acc, [key, childGroup]) => {
                            const newRecords = removeRecursive(
                                childGroup.records,
                                nodeToRemove
                            );
                            if (newRecords.length > 0) {
                                acc[key] = {
                                    ...childGroup,
                                    records: newRecords,
                                };
                            }
                            return acc;
                        },
                        {} as Record<string, { records: HierarchyNode[] }>
                    );
                    return { ...item, children: newChildren };
                }
                return item;
            });
    };

    /**
     * Removes a node from the hierarchyData state.
     *
     * @param {HierarchyNode} node - The node to remove from the hierarchyData.
     * @return {void} This function does not return anything.
     */
    const removeItem = (node: HierarchyNode) => {
        const updatedData = removeRecursive(hierarchyData, node);
        setHierarchyData(updatedData);
    };

    return (
        <DataContext.Provider value={{ hierarchyData, removeItem }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
