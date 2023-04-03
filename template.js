module.exports = {
    dir: 'src/components',
    ext: 'ts',
    n: true,
    t: 'functional',
    templates: {
        functional: `import React from 'react';

const <%= componentName %>: React.FC = () => {
  return (
    <div>
      <%= componentName %> component
    </div>
  );
};

export default <%= componentName %>;
`,
    }
};

