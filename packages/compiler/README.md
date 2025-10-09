# Doodl ✏︎

> A modern type-safe templating engine

```dood
<!-- Run TypeScript via Node -->
<setup>
import {v4} from "uuid";

const data = {
    hello: !!v4 ? 123 : null
};
</setup>

<!-- Use `lang` to change the syntax highlighting of the `output` block -->
<output lang="json">
{
    "//": "Interpolate values with << >>",
    "test": <<data.hello>>
}
</output>
```

# Installation

```shell
npm install doodl
```

# Prerequisites

- Node v22.18+