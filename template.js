module.exports = {
    dir: 'src/components',
    ext: 'ts',
    n: true,
    t: 'functional',
    templates: {
        functional: `import React from "react";

interface Props {
}

const $COMPONENT_NAME = ({
}: Props) => {
    return (
        <div>
        </div>
    );
};

export default $COMPONENT_NAME;`,
        storybook: `import $COMPONENT_NAME from "./COMPONENT_NAME";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof $COMPONENT_NAME> = {
    title: "$COMPONENT_NAME",
    component: $COMPONENT_NAME,
    tags: ["autodocs"],
}

export default meta;
type Story = StoryObj<typeof $COMPONENT_NAME>;

export const Default: Story = {
    args: { 
    },
}`,
        index: `export { default } from "./$COMPONENT_NAME";`
    }
};

