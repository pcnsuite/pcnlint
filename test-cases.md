# Root document
1. document must be valid JSON
2. metadata is valid json
3. domains is array of objects
4. steps is array of objects

# Domain
1. id is string
2. id is unique
3. title is string
4. subtitle is string

# Steps
1. id is unique identifier
2. id is string
3. title is string
4. type is one of process|decision|wait|divergent_process
5. type is string
6. emphasized is true or false, or does not exist (implied false)
7. value_specific is integer or does not exist
8. value_generic is integer or does not exist
9. predecessors is array of objects or empty array or does not exist
10. predecessor has string id
11. predecessor has id that exists among steps
12. type is one of "normal_relationship"|"loose_temporal_relationship"
13. title is string or does not exist
14. domain is object
15. domain id is string
16. domain id is pre-defined in document
17. region is object
18. region type is one of independent|surrogate|direct_leading|direct_shared
19. if region type is not independent, region with_domain must be valid domain id
20. if region type is not independent, region with_domain must be string
21. problems is array of objects or non-existent
22. problem type is one of "inconvenient"|"confusing"|"difficult"|"likely_to_fail"
23. problem type is string
24. problem description is string




