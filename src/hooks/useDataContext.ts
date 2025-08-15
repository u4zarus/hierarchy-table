import { useContext } from "react";
import DataContext from "../context/DataContext";

/**
 * A custom hook that provides access to the data context.
 *
 * This hook must be used within a `DataProvider` component. If not, an error will be thrown.
 *
 * @return {DataContextType} The data context object.
 * @throws {Error} If used outside of a `DataProvider`.
 */
export const useDataContext = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useDataContext must be used within a DataProvider");
    }
    return context;
};
