# GitHub Copilot Custom Instructions

## General Development Principles

- Write clean, readable, and maintainable code
- Follow SOLID principles and DRY (Don't Repeat Yourself)
- Prefer composition over inheritance
- Use meaningful variable and function names that clearly express intent
- Write self-documenting code with minimal but effective comments
- Implement proper error handling and edge case considerations
- Follow consistent code formatting and style guidelines
- Prioritize performance and accessibility from the start
- Follow each project's Prettier configuration.

## TypeScript Best Practices

- Use strict TypeScript configuration (`strict: true`)
- Prefer `interface` over `type` for object shapes when possible
- Use union types and literal types for better type safety
- Implement proper generic constraints and utility types
- Avoid `any` type - use `unknown` or proper typing instead
- Use type assertions sparingly and prefer type guards
- Leverage discriminated unions for complex state management
- Export types alongside implementation code
- Use `const assertions` for immutable data structures
- Implement proper error types and result types for async operations
- Don't use semicolons

```typescript
// Preferred patterns
interface User {
  readonly id: string
  name: string
  email: string
}

type Status = 'loading' | 'success' | 'error'

// Use type guards
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj
}
```

## React Best Practices

### Component Architecture

- Use functional components with hooks over class components
- Keep components small and focused on a single responsibility
- Use proper component composition and avoid prop drilling
- Implement custom hooks for reusable stateful logic
- Use React.memo() for performance optimization when appropriate
- Prefer controlled components over uncontrolled components

### State Management

- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Implement proper state normalization for complex data
- Use context sparingly - prefer prop passing for most cases
- Consider state management libraries (Zustand, Redux Toolkit) for global state

### Performance

- Use `useMemo` and `useCallback` judiciously to prevent unnecessary re-renders
- Implement code splitting with `React.lazy()` and `Suspense`
- Use proper key props in lists (avoid array indices as keys)
- Implement virtualization for large lists
- Use React DevTools Profiler to identify performance bottlenecks

### Hooks Patterns

```typescript
// Custom hook example
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue] as const
}
```

## Svelte Best Practices

### Component Architecture

- Keep components small and focused on single responsibilities
- Use proper component composition with slots and slot props
- Leverage Svelte's built-in reactivity system over external state management
- Use TypeScript with Svelte for better type safety
- Implement proper component lifecycle management
- Prefer Svelte's native features over external libraries when possible

### Reactivity and State Management

- Use reactive statements (`$:`) for derived state and side effects
- Implement stores for shared state across components
- Use writable, readable, and derived stores appropriately
- Avoid unnecessary reactivity with proper dependency tracking
- Use context API for deep component communication
- Implement proper store subscriptions and cleanup

```typescript
// Store patterns
import { writable, derived } from 'svelte/store'

interface User {
  id: string
  name: string
  email: string
}

export const user = writable<User | null>(null)
export const isLoggedIn = derived(user, ($user) => $user !== null)

// Custom store with methods
function createCounter() {
  const { subscribe, set, update } = writable(0)

  return {
    subscribe,
    increment: () => update((n) => n + 1),
    decrement: () => update((n) => n - 1),
    reset: () => set(0)
  }
}

export const counter = createCounter()
```

### Performance Optimization

- Use `{#key}` blocks to force re-rendering when needed
- Implement proper component lazy loading with dynamic imports
- Use `bind:this` sparingly and prefer reactive patterns
- Optimize animations with Svelte's built-in animation system
- Use `tick()` for DOM synchronization when necessary
- Implement proper component cleanup in `onDestroy`

### SvelteKit Specific Practices

- Use proper page and layout structure
- Implement SSR/SSG appropriately based on content needs
- Use load functions for data fetching and preloading
- Implement proper error handling with error pages
- Use form actions for progressive enhancement
- Leverage SvelteKit's routing and navigation features

```typescript
// SvelteKit load function example
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, params }) => {
  try {
    const response = await fetch(`/api/posts/${params.id}`)
    if (!response.ok) {
      throw new Error('Post not found')
    }

    const post = await response.json()
    return { post }
  } catch (error) {
    throw error(404, 'Post not found')
  }
}
```

### Svelte Syntax Best Practices

- Use proper event handling with `on:event` directive
- Implement two-way binding judiciously with `bind:` directive
- Use conditional rendering with `{#if}` blocks effectively
- Implement proper list rendering with `{#each}` and unique keys
- Use await blocks (`{#await}`) for async data rendering
- Leverage Svelte's transition and animation systems

```svelte
<!-- Component example with best practices -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade, slide } from "svelte/transition";
  import type { Item } from "$lib/types";

  export let items: Item[] = [];
  export let loading = false;

  let searchTerm = "";
  let unsubscribe: (() => void) | undefined;

  // Reactive statement for filtering
  $: filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Lifecycle management
  onMount(() => {
    // Setup subscriptions
    unsubscribe = someStore.subscribe((value) => {
      // Handle store updates
    });
  });

  onDestroy(() => {
    // Cleanup subscriptions
    unsubscribe?.();
  });

  function handleItemClick(item: Item) {
    // Event handler
    dispatch("itemSelected", item);
  }
</script>

<div class="item-list">
  <input bind:value={searchTerm} placeholder="Search items..." type="text" />

  {#if loading}
    <div transition:fade>Loading...</div>
  {:else if filteredItems.length === 0}
    <div transition:slide>No items found</div>
  {:else}
    {#each filteredItems as item (item.id)}
      <div
        class="item"
        transition:slide
        on:click={() => handleItemClick(item)}
        on:keydown={(e) => e.key === "Enter" && handleItemClick(item)}
        tabindex="0"
        role="button"
      >
        {item.name}
      </div>
    {/each}
  {/if}
</div>

<style>
  .item-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .item {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .item:hover,
  .item:focus {
    background-color: var(--hover-bg);
  }
</style>
```

### Styling Best Practices

- Use scoped styles by default in Svelte components
- Implement CSS custom properties for theming
- Use `:global()` modifier sparingly for global styles
- Leverage Svelte's style directive for dynamic styling
- Use CSS classes over inline styles for maintainability
- Implement proper responsive design within component styles

### Forms and Validation

- Use Svelte's built-in form handling capabilities
- Implement proper form validation with reactive statements
- Use bind:group for radio buttons and checkboxes
- Leverage SvelteKit's form actions for server-side processing
- Implement proper error handling and user feedback
- Use progressive enhancement principles

### Testing Best Practices

- Use `@testing-library/svelte` for component testing
- Test component behavior, not implementation details
- Use proper mocking for stores and external dependencies
- Implement integration tests for SvelteKit routes
- Test accessibility and keyboard navigation
- Use Playwright for end-to-end testing

```typescript
// Testing example
import { render, screen, fireEvent } from '@testing-library/svelte'
import { expect, test } from 'vitest'
import Component from './Component.svelte'

test('renders component correctly', async () => {
  const { component } = render(Component, {
    props: { items: [{ id: '1', name: 'Test Item' }] }
  })

  expect(screen.getByText('Test Item')).toBeInTheDocument()

  await fireEvent.click(screen.getByText('Test Item'))
  // Assert expected behavior
})
```

## HTML Best Practices

- Use semantic HTML5 elements (`<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`)
- Implement proper heading hierarchy (h1 → h2 → h3, no skipping levels)
- Use appropriate ARIA attributes for accessibility
- Include proper `alt` attributes for images
- Use `<button>` for actions and `<a>` for navigation
- Implement proper form labels and validation
- Use `<meta>` tags for SEO and social media sharing
- Ensure proper document structure and DOCTYPE declaration

```html
<!-- Semantic structure example -->
<main role="main">
  <section aria-labelledby="products-heading">
    <h2 id="products-heading">Featured Products</h2>
    <article>
      <h3>Product Name</h3>
      <img src="product.jpg" alt="Product description" />
    </article>
  </section>
</main>
```

## CSS Best Practices

### Architecture and Organization

- Use CSS-in-JS solutions (styled-components, emotion) or CSS Modules
- Follow BEM methodology for traditional CSS class naming
- Organize styles with logical grouping and consistent structure
- Use CSS custom properties (variables) for theming and consistency
- Implement mobile-first responsive design principles

### Modern CSS Features

- Use CSS Grid and Flexbox for layouts
- Implement CSS logical properties for better internationalization
- Use `clamp()`, `min()`, `max()` for responsive typography and spacing
- Leverage CSS container queries when appropriate
- Use `aspect-ratio` property for maintaining proportions

### Performance and Maintainability

- Minimize CSS bundle size and eliminate unused styles
- Use efficient selectors and avoid deeply nested rules
- Implement proper CSS reset or normalization
- Use consistent naming conventions and spacing units
- Optimize for both light and dark themes

```css
/* Modern CSS patterns */
.card {
  container-type: inline-size;
  display: grid;
  gap: clamp(1rem, 2.5vw, 2rem);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

@container (min-width: 300px) {
  .card {
    grid-template-columns: auto 1fr;
  }
}
```

## Testing Best Practices

- Write tests that focus on behavior, not implementation details
- Use React Testing Library for component testing
- Implement proper test coverage for critical paths
- Use descriptive test names that explain the expected behavior
- Mock external dependencies appropriately
- Use factories or builders for test data creation
- Implement integration tests for critical user flows

```typescript
// Testing example
describe('UserProfile', () => {
  it('displays user information correctly', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' }
    render(<UserProfile user={mockUser} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})
```

## Security Best Practices

- Sanitize user inputs and prevent XSS attacks
- Use HTTPS for all production deployments
- Implement proper authentication and authorization
- Use environment variables for sensitive configuration
- Regularly update dependencies and check for vulnerabilities
- Implement Content Security Policy (CSP) headers
- Use secure coding practices for data handling

## Performance Optimization

- Implement proper bundling and code splitting strategies
- Use lazy loading for images and components
- Optimize asset delivery with CDNs and proper caching
- Implement service workers for offline functionality
- Monitor and optimize Core Web Vitals
- Use performance budgets and automated testing
- Implement proper database indexing and query optimization

## Development Workflow

- Use semantic commit messages and conventional commits
- Implement proper branching strategy (Git Flow or GitHub Flow)
- Use pull request templates and code review checklists
- Automate testing and deployment with CI/CD pipelines
- Use linting and formatting tools (ESLint, Prettier)
- Implement proper environment configuration
- Use feature flags for gradual rollouts

## Code Style Preferences

- Use 2 spaces for indentation
- Prefer single quotes for strings
- Use trailing commas in multi-line structures
- Use semicolons consistently
- Prefer arrow functions for callbacks and short functions
- Use destructuring for object and array access
- Implement proper TypeScript strict mode configuration

## Error Handling and Logging

- Implement proper error boundaries in React applications
- Use structured logging with appropriate log levels
- Implement proper error reporting and monitoring
- Handle async operations with proper try-catch blocks
- Use result types for operations that can fail
- Implement graceful degradation for non-critical features

## Accessibility Guidelines

- Ensure keyboard navigation support
- Implement proper color contrast ratios
- Use semantic HTML and ARIA attributes correctly
- Test with screen readers and accessibility tools
- Implement focus management for dynamic content
- Provide alternative text for visual content
- Ensure responsive design works across devices and zoom levels
- Use accessible forms with proper labels and instructions
