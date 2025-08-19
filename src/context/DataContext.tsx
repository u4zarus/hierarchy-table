import {
    createContext,
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { HierarchyNode } from "./types";

interface DataContextType {
    hierarchyData: HierarchyNode[];
    headers: string[];
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
    const [headers, setHeaders] = useState<string[]>([]);
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

                if (data.length > 0) {
                    const firstItem = data[0].data;
                    setHeaders(Object.keys(firstItem));
                }
            } catch (error) {
                setError("Error fetching data");
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /**
     * Recursively removes a node from a nested array of HierarchyNode objects.
     *
     * @param {HierarchyNode[]} items - The array of HierarchyNode objects to search through.
     * @param {HierarchyNode} nodeToRemove - The node to remove from the array.
     * @return {HierarchyNode[]} A new array with the nodeToRemove removed.
     */
    const removeRecursive = (
        items: HierarchyNode[],
        nodeToRemove: HierarchyNode
    ): HierarchyNode[] => {
        return items
            .filter((item) => item !== nodeToRemove)
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

    const removeItem = useCallback((node: HierarchyNode) => {
        setHierarchyData((prevData) => removeRecursive(prevData, node));
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <DataContext.Provider value={{ hierarchyData, headers, removeItem }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
