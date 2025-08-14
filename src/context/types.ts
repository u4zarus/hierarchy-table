export interface DataItem {
    [key: string]: string | number | boolean;
}

export interface HierarchyNode {
    data: DataItem;
    children: {
        [key: string]: {
            records: HierarchyNode[];
        };
    };
}
