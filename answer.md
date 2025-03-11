# EBUDDY Technical Test Answers

## Part 4: Bonus Firebase Technical Questions

### Efficient User Ranking and Pagination Strategy

The challenge is to create a sophisticated ranking system for users that considers multiple factors:

- Total average weighted ratings
- Number of rents
- Recent activity

**Proposed Solution:**

```typescript
function calculatePotentialScore(user: User): number {
  const MAX_RATING = 5.0;
  const MAX_RENTS = 100;
  const RECENT_ACTIVITY_WINDOW = 7 * 24 * 60 * 60 * 1000;

  const ratingScore =
    ((user.totalAverageWeightRatings || 0) / MAX_RATING) * 0.6;
  const rentsScore = Math.min((user.numberOfRents || 0) / MAX_RENTS, 1) * 0.3;

  const now = Date.now();
  const activityTimestamp =
    user.recentlyActive instanceof Object
      ? user.recentlyActive._seconds * 1000
      : user.recentlyActive || 0;

  const activityAge = now - activityTimestamp;
  const activityScore =
    Math.max(0, 1 - activityAge / RECENT_ACTIVITY_WINDOW) * 0.1;

  return ratingScore + rentsScore + activityScore;
}

async function fetchPotentialUsers(limit = 10, lastDocId?: string) {
  const usersRef = firestore().collection("USERS");
  const snapshot = await usersRef.get();

  const rankedUsers = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
      potentialScore: calculatePotentialScore(doc.data() as User),
    }))
    .sort((a, b) => b.potentialScore - a.potentialScore);

  const startIndex = lastDocId
    ? rankedUsers.findIndex((user) => user.id === lastDocId) + 1
    : 0;

  return rankedUsers.slice(startIndex, startIndex + limit);
}
```

### Keeping 'recentlyActive' Updated

**Strategies:**

1. **Client-Side Updates**

   - Update on page load
   - Track user interactions
   - Periodic background updates

2. **Backend Middleware**

   - Automatically update activity on API requests
   - Track and refresh user timestamps

3. **Scheduled Cloud Functions**
   - Periodically refresh inactive user statuses
   - Mark long-term inactive accounts

## Part 5: Personality & Technical Questions

### 1. Reddit Settings Page Client-Side Components

- Use browser developer tools
- Identify dynamically updated elements
- Look for instant UI changes without page reload
- Focus on interactive toggles and real-time validations

### 2. Most Difficult Technical Problems

- Performance bottlenecks in large-scale systems
- Microservices communication complexity
- Key solutions:
  - Comprehensive performance profiling
  - Architectural redesign
  - Robust error handling
  - Implement monitoring and tracing

### 3. Project Approach

1. Thorough requirement analysis
2. Detailed planning and risk assessment
3. Iterative design and prototyping
4. Agile implementation
5. Comprehensive testing
6. Continuous deployment
7. Ongoing maintenance and improvement

### 4. Learning New Topics

- Research and understand context
- Create structured learning path
- Hands-on practical implementation
- Engage with community
- Continuous application and reflection

### 5. Consistency vs Efficiency

**Choice: Consistency**

- Sustainable long-term progress
- Reliable quality
- Predictable performance
- Continuous improvement
- Reduced stress and cognitive load

### 6. Apple Products

I have iphone

### 7. Immediate Availability

2 week
