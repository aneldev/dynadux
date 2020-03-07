[🔙 Back to the main page](../README.md)

# Dynadux Store

An instance of the Dynadux has the `state` getter and the `dispatch` method only.

# Business Store

In an instance that uses internally the Dynadux and it has 
- state getter(s)
- methods to update the state
- onChange callback to let know the changes

# Reducer

Is a function is called with
- state
- action
- payload 
- dispatch method
and returns the new version of the state


