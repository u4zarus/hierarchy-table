import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DataContext, { DataProvider } from "./DataContext";
import "@testing-library/jest-dom";
import { vi, beforeEach, afterEach, test, expect } from "vitest";

const mockData = [
    {
        data: { ID: "1", Name: "Test character" },
        children: {},
    },
];

const nestedMockData = [
    {
        data: { ID: "1", Name: "Parent" },
        children: {
            groupA: {
                records: [{ data: { ID: "2", Name: "Child" }, children: {} }],
            },
        },
    },
];

beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => mockData,
    } as Response);
});

afterEach(() => {
    vi.restoreAllMocks();
});

const TestConsumer = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("DataContext is not available");
    }
    return (
        <div>
            {context.hierarchyData.map((item) => (
                <span key={String(item.data.ID)}>{item.data.Name}</span>
            ))}
            <button
                onClick={() => context.removeItem(context.hierarchyData[0])}
            >
                Remove
            </button>
        </div>
    );
};

test("renders loading state initially", () => {
    render(
        <DataProvider>
            <div>Child</div>
        </DataProvider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("fetches data and provides it via context", async () => {
    render(
        <DataProvider>
            <TestConsumer />
        </DataProvider>
    );
    await waitFor(() => {
        expect(screen.getByText(/Test character/i)).toBeInTheDocument();
    });
});

// DataContext.test.tsx
test("removeItem updates the hierarchyData", async () => {
    render(
        <DataProvider>
            <TestConsumer />
        </DataProvider>
    );

    const item = await screen.findByText(/Test character/i);
    screen.getByText("Remove").click();

    await waitFor(() => expect(item).not.toBeInTheDocument());
});

test("removeItem removes nested child", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => nestedMockData,
    } as Response);

    const NestedConsumer = () => {
        const context = useContext(DataContext)!;
        const childNode =
            context.hierarchyData[0]?.children?.groupA?.records[0];
        return (
            <div>
                <span>{context.hierarchyData[0].data.Name}</span>
                {childNode && <span>{childNode.data.Name}</span>}
                {childNode && (
                    <button onClick={() => context.removeItem(childNode)}>
                        Remove Child
                    </button>
                )}
            </div>
        );
    };

    render(
        <DataProvider>
            <NestedConsumer />
        </DataProvider>
    );

    await screen.findByText("Parent");
    const childElement = await screen.findByText("Child");

    screen.getByText("Remove Child").click();

    await waitFor(() => expect(childElement).not.toBeInTheDocument());
});

test("displays error message if fetch fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
    } as Response);

    render(
        <DataProvider>
            <div>Child</div>
        </DataProvider>
    );

    await waitFor(() =>
        expect(screen.getByText(/error fetching data/i)).toBeInTheDocument()
    );
});

test("removeItem with non-existing ID does not change data", async () => {
    render(
        <DataProvider>
            <TestConsumer />
        </DataProvider>
    );

    await screen.findByText(/Test character/i);

    screen.getByText("Remove").click();
});

test("removeItem removes nested child", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => nestedMockData,
    } as Response);

    const NestedConsumer = () => {
        const context = useContext(DataContext)!;
        return (
            <div>
                {context.hierarchyData.map((item) => (
                    <span key={String(item.data.ID)}>{item.data.Name}</span>
                ))}
                {context.hierarchyData[0]?.children?.groupA?.records.map(
                    (child) => (
                        <span key={String(child.data.ID)}>
                            {child.data.Name}
                        </span>
                    )
                )}
                <button
                    onClick={() =>
                        context.removeItem(
                            context.hierarchyData[0]?.children?.groupA
                                ?.records[0]
                        )
                    }
                >
                    Remove Child
                </button>
            </div>
        );
    };

    render(
        <DataProvider>
            <NestedConsumer />
        </DataProvider>
    );

    await screen.findByText("Parent");
    const childElement = await screen.findByText("Child", { selector: "span" });

    screen.getByRole("button", { name: "Remove Child" }).click();

    await waitFor(() => expect(childElement).not.toBeInTheDocument());
});
