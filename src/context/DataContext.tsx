import { createContext, useEffect, useState, type ReactNode } from "react";
import type { HierarchyNode } from "./types";

interface DataContextType {
    hierarchyData: HierarchyNode[];
    removeItem: (
        id: string,
        parentData: HierarchyNode[] | HierarchyNode
    ) => void;
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

    const removeItem = (id: string, items: HierarchyNode[] | HierarchyNode) => {
        if (Array.isArray(items)) {
            const updatedItems = items.filter((item) => item.data.ID !== id);
            setHierarchyData(updatedItems);
        }
    };

    return (
        <DataContext.Provider value={{ hierarchyData, removeItem }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
