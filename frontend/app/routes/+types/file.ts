export type File = {
    name: string;
    filepath: string;
};

export type Route = {
    LoaderArgs: {};
    ComponentProps: {
        loaderData: {
            files: File[];
        };
    };
};
