import {COMPONENT_NAME as Component} from "./COMPONENT_NAME";
import {ComponentStory} from "@storybook/react";

export default {
  title: `Components/${Component.name}`,
  component: Component
}

const Template: ComponentStory<typeof Component> = (args) => <Component {...args}/>;

export const Default = Template.bind({});
