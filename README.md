# Exp Test App

- `npx expo start`
  - Use `ctrl + up/down` to resize window.
- [TS Playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAYg9nAJlAvFA3gKCjqYBOcwEAlgHYAKE+AEhAMbBwDm+AhgLYBcUZArhwBG1bLgBmbYFVoMmrTj35CRuKPTb5BAZ2l1GLdt14Dh)
- [Color Hex - ColorHexa.com](https://www.colorhexa.com/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [React - docs](https://react.dev/)
- [React Native - docs](https://reactnative.dev/)
- [Expo - docs](https://docs.expo.dev/)
- [React Native Example for Android and iOS](https://reactnativeexample.com/)
- Obsidian note: `javascript_typescript_react_native`

---

- [ ] Read on How React Works, then React Native, Then React Native Expo. OR some such. Read it all.
- [ ] Learn about managing state [Managing State – React](https://react.dev/learn/managing-state)
- [ ] learn more about the DOM [Introduction to the DOM - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction#fundamental_data_types)
- [ ] read
  - [ ] [How and when to force a React component to re-render - LogRocket Blog](https://blog.logrocket.com/how-when-to-force-react-component-re-render/)
  - [ ] [React Force Rerender: Complete Tutorial - BairesDev Blog: Insights on Software Development &amp; Tech Talent](https://www.bairesdev.com/blog/react-force-rerender/)
- [ ] watch
  - [ ] [Local SQLite Database for Expo React Native App with Import and Export Database from Device Files](https://www.youtube.com/watch?v=1kSLd9oQX7c)

---

- [Learn to become a modern React Native developer](https://roadmap.sh/react-native)

---

## More Resources

- [awesome-react: A collection of awesome things regarding React ecosystem](https://github.com/enaqx/awesome-react)
- [awesome-react-native: Awesome React Native components, news, tools, and learning material!](https://github.com/jondot/awesome-react-native)
- [create-react-app: Set up a modern web app by running one command.](https://github.com/facebook/create-react-app)

# Database

- [ ] Learn about good database design
- What is the actual difference between an ingredient, recipe, food, and meal?
  - meal
      - Has nutrient content
        - Fat
        - Carbs
        - Protein
      - Can be made up out of multi foods
      - can have a step plan pointing to multiple recipes to make the meal
  - recipe
    - steps to make it
    - Has nutrient content
      - Fat
      - Carbs
      - Protein
  - Food
    - can be made up out of 1 or more ingredients
    - Has nutrient content
    - Fat
      - Carbs
      - Protein
  - Ingredient
      - Has nutrient content
        - Fat
        - Carbs
        - Protein
  - user should be able to select any of these that they have consumed
      - and it should tally correctly to daily consumption of kcals, fats, carbs, and proteins

# ToDo

- todo MEDIUM PRIORITY top level component (pages and tabs) should override the stylesheet margin of a component's outermost JSX element. The most top level component should always handle margin to enforce consistency. Or should a component have its own margin or padding?. Margin is extra space outside border, padding is extra space inside border. I want all UI elements have the same distance from the edge of the screen. Currently that is done haphazardly, and isn't enforced consistently. I have to remember to set the right margin/padding. It is a pain. Is `useContext` a workable solution? Google solutions.
- todo HIGH PRIORITY DynamicTable does not render on my phone (Nokia g20 with Android 13). Database exists. So, I suspect the problem is with the component. I am using features that are not available on my android version? I do my testing on a simulator which runs Android 14.

# Bugs

- bug some tables are not updating when I food or consumed item is added? verify this
