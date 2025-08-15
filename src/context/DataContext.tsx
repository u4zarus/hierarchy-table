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
