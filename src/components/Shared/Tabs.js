// Tabs by @cassidoo
// github.com/cassidoo/react-tailwind-tabs

import React, { useState, createContext, useContext, Children } from "react";


// Customize your colors
let tabBackgroundColorClass = "bg-white";
let borderColorClass = "border-blue-500";
let hoverBorderColorClass = "hover:border-blue-500";
let textColorClass = "text-blue-500";
let hoverTextColorClass = "hover:text-blue-600";

const TabsContext = createContext();

function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

const TabContext = createContext();

function TabList({ children }) {
  const wrappedChildren = Children.map(children, (child, index) => (
    <TabContext.Provider value={index}>{child}</TabContext.Provider>
  ));
  return (
    <ul className="flex flex-wrap justify-center mb-6 border-b border-gray-200">
      {wrappedChildren}
    </ul>
  );
}

function Tab({ children, isDisabled, ...rest }) {
  const index = useContext(TabContext);
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  const isActive = index === activeIndex;

  return (
    <li
      className={`inline-block cursor-pointer font-medium text-sm px-6 py-3 transition-all duration-300 
        ${isDisabled
          ? "cursor-not-allowed opacity-50"
          : isActive
            ? `text-blue-500 border-b-2 border-blue-500`
            : `text-gray-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-500`
        }`}
      onClick={isDisabled ? undefined : () => setActiveIndex(index)}
      key={index + "tab"}
      {...rest}
    >
      {children}
    </li>
  );
}

function TabPanels({ children }) {
  const { activeIndex } = useContext(TabsContext);
  return (
    <div className="p-6 bg-white border rounded shadow">
      {children[activeIndex]}
    </div>
  );
}

function TabPanel({ children }) {
  return children;
}

function ComposedTabs({ data }) {
  return (
    <Tabs>
      <TabList>
        {data.map((tab, i) => (
          <Tab isDisabled={tab.disabled} key={`tw-tab-${i}`}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {data.map((tab, i) => (
          <TabPanel key={`tw-tabp-${i}`}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}

export { Tabs, TabList, Tab, TabPanels, TabPanel, ComposedTabs };
