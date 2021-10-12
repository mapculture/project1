## Building Plan

### Build A:

- UI:
    - 1-10 destinations (addresses, not coordinates)
    - Some kind of reset button to start a new request
    - Robustness (good layout, no way for user to deform functionality/design)
- Maps API output:
    - Draw markers for each location
    - Produce a route in order of the inputted destinations (no TSP algorithm used yet)
    - Distance matrix calculation
- Backend (Flask server):
    - Receive addresses and distance matrix calculation from frontend
    - Prepare to provide inputs to one or both TSP algorithms
- MST algorithm:
    -
    -
- Genetic algorithm:
    -
    -
    -
- Documentation:
    - Project Plan complete
    - SRS rough draft
    - SDS rough draft
- Database/Backend:
    - Simple session data storage (Cookies) (MongoDB?)

### Build B:
- UI:
    - Option to choose between algorithms?
    - Home page to display the service we are selling
        - Perhaps different users could have different benefits?
            - Example: $1000/month for unlimited queries
            - (This could be anything)
    - User login page
- Frontend:
    - User login
        - Security
        - Connect to backend/database
- MST Algorithm:  
    - 
    - Complete, implanted in backend
- Genetic Algorithm:  
    - 
    - Complete, implanted in backend
- Backend (Flask server):
    - Implant TSP algorithms
    - Feed distance matrix inputs to algorithms, output back to frontend
- Database/Backend:
    - User storage:
        - Usernames, passwords, what subscription they have, how many queries have they requested
        - What queries were requested and when?
- Documentation:
    - SRS final draft
    - SDS final draft
