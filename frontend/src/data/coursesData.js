// B.Tech Artificial Intelligence and Data Science (AIDS) Curriculum - R2023
export const semestersData = {
  1: [
    {
      course_code: "HS23111",
      course_name: "Technical Communication I",
      credits: 3,
      category: "HS",
      description: "Focuses on developing foundational English communication skills for engineering students.",
      learning_outcomes: ["Read and comprehend technical texts", "Write basic technical descriptions", "Participate in group discussions"],
      units: [
        {
          unit_number: 1,
          title: "Basics of Technical Communication",
          learning_objectives: "Understand communication barriers and core grammar.",
          topics: ["Word analysis", "Sentence structure", "Parts of speech"],
          subtopics: ["Prefixes & suffixes", "Nouns & verbs", "Tense agreement"],
          resources: ["Oxford Guide to Technical Communication"]
        },
        {
          unit_number: 2,
          title: "Reading and Vocabulary Development",
          learning_objectives: "Develop active reading strategies.",
          topics: ["Skimming", "Scanning", "Contextual meaning"],
          subtopics: ["Inference", "Topic sentence", "Vocabulary building"],
          resources: ["Reading Skills Handbook"]
        },
        {
          unit_number: 3,
          title: "Technical Writing Basics",
          learning_objectives: "Draft clear, coherent technical paragraphs.",
          topics: ["Paragraph writing", "Cohesive devices", "Technical description"],
          subtopics: ["Linkers", "Defining objects", "Summarization"],
          resources: ["Technical Writing Essentials"]
        },
        {
          unit_number: 4,
          title: "Listening and Speaking Skills",
          learning_objectives: "Improve oral reception and expression.",
          topics: ["Active listening", "Pronunciation", "Short talks"],
          subtopics: ["Intonation", "Visual aid description", "Conversational English"],
          resources: ["Effective Speaking Skills"]
        },
        {
          unit_number: 5,
          title: "Introduction to Business Letters",
          learning_objectives: "Format and write simple business communications.",
          topics: ["Formal letters", "Email etiquette", "Leave applications"],
          subtopics: ["Salutations", "Structure of a letter", "Tone in writing"],
          resources: ["Business Communication Today"]
        }
      ]
    },
    {
      course_code: "MA23116",
      course_name: "Mathematical Foundations for AI",
      credits: 4,
      category: "BS",
      description: "Linear Algebra, Calculus, and Matrices essential for advanced AI models.",
      learning_outcomes: ["Perform matrix operations", "Analyze vector spaces", "Apply derivatives to optimization problems"],
      units: [
        {
          unit_number: 1,
          title: "Matrices and Eigenvalues",
          learning_objectives: "Solve linear systems and understand eigen-decomposition.",
          topics: ["Matrix operations", "Eigenvalues & Eigenvectors", "Cayley-Hamilton Theorem"],
          subtopics: ["Inverse of a matrix", "Characteristic equation", "Diagonalization"],
          resources: ["Linear Algebra and its Applications by Gilbert Strang"]
        },
        {
          unit_number: 2,
          title: "Vector Spaces",
          learning_objectives: "Understand dimensions, basis, and linear independence.",
          topics: ["Vector spaces", "Subspaces", "Linear independence"],
          subtopics: ["Basis and dimension", "Inner product spaces", "Gram-Schmidt orthogonalization"],
          resources: ["Introduction to Linear Algebra"]
        },
        {
          unit_number: 3,
          title: "Differential Calculus",
          learning_objectives: "Master differentiation and curvature computation.",
          topics: ["Limits and continuity", "Differentiation", "Curvature & Evolutes"],
          subtopics: ["Rules of differentiation", "Tangents", "Evolutes computation"],
          resources: ["Thomas' Calculus"]
        },
        {
          unit_number: 4,
          title: "Multivariable Calculus",
          learning_objectives: "Optimize functions of multiple variables.",
          topics: ["Partial derivatives", "Jacobians", "Lagrange multipliers"],
          subtopics: ["Taylor series expansion", "Maxima and minima", "Constraint optimization"],
          resources: ["Calculus of Several Variables"]
        },
        {
          unit_number: 5,
          title: "Linear Transformations",
          learning_objectives: "Represent linear transformations as matrices.",
          topics: ["Linear transformation", "Kernel and range", "Matrix representation"],
          subtopics: ["Rank-nullity theorem", "Composition", "Change of basis"],
          resources: ["Advanced Engineering Mathematics by Kreyszig"]
        }
      ]
    },
    {
      course_code: "GE23117",
      course_name: "Heritage of Tamils",
      credits: 1,
      category: "HS",
      description: "Explores the rich culture, history, language, and heritage of Tamils.",
      learning_outcomes: ["Understand ancient Tamil society", "Appreciate Sangam literature", "Learn about historic architecture"],
      units: [
        {
          unit_number: 1,
          title: "Language and Literature",
          learning_objectives: "Explore Sangam literature and linguistic roots.",
          topics: ["Sangam literature", "Thirukkural", "Evolution of script"],
          subtopics: ["Ettuthokai", "Pathupattu", "Tamil Brahmi script"],
          resources: ["History of Tamil Literature"]
        },
        {
          unit_number: 2,
          title: "Heritage and Archaeology",
          learning_objectives: "Study archaeological findings like Keezhadi.",
          topics: ["Keezhadi excavations", "Adichanallur", "Hero stones"],
          subtopics: ["Pottery inscriptions", "Megolithic sites", "Epigraphy"],
          resources: ["Tamil Nadu Archaeological Reports"]
        },
        {
          unit_number: 3,
          title: "Arts and Crafts",
          learning_objectives: "Appreciate traditional visual and performing arts.",
          topics: ["Sculptures", "Bronzes of Chola", "Folk dances"],
          subtopics: ["Karagattam", "Silambam", "Terracotta art"],
          resources: ["Arts of Tamil Nadu"]
        },
        {
          unit_number: 4,
          title: "Flora, Fauna and Agriculture",
          learning_objectives: "Learn about traditional irrigation and land divisions.",
          topics: ["Five landscapes (Thinai)", "Ancient irrigation", "Traditional crops"],
          subtopics: ["Kurinji, Mullai, Marutham", "Kallanai dam", "Water management"],
          resources: ["Landscape & Ancient Life"]
        },
        {
          unit_number: 5,
          title: "Trade and Global Connections",
          learning_objectives: "Examine maritime trade in ancient Tamil Nadu.",
          topics: ["Maritime trade", "Ancient ports", "Roman connections"],
          subtopics: ["Poompuhar port", "Spices trade", "Roman coins in TN"],
          resources: ["Maritime History of Coromandel Coast"]
        }
      ]
    },
    {
      course_code: "PH23132",
      course_name: "Physics for Information Science",
      credits: 3,
      category: "BS",
      description: "Semiconductors, fiber optics, and magnetic storage physics.",
      learning_outcomes: ["Understand semiconductor devices", "Explain optical fibers", "Analyze magnetic storage physics"],
      units: [
        {
          unit_number: 1,
          title: "Conducting Materials",
          learning_objectives: "Understand classical and quantum free electron theories.",
          topics: ["Classical free electron theory", "Quantum free electron theory", "Fermi-Dirac statistics"],
          subtopics: ["Drift velocity", "Wiedemann-Franz law", "Density of states"],
          resources: ["Solid State Physics by Kittel"]
        },
        {
          unit_number: 2,
          title: "Semiconducting Materials",
          learning_objectives: "Explain carrier concentration and Hall effect.",
          topics: ["Intrinsic semiconductors", "Extrinsic semiconductors", "Hall effect"],
          subtopics: ["Fermi level derivation", "Band gap", "Hall coefficient measurement"],
          resources: ["Semiconductor Physics and Devices by Neamen"]
        },
        {
          unit_number: 3,
          title: "Magnetic and Superconducting Materials",
          learning_objectives: "Understand domain theory and Meissner effect.",
          topics: ["Magnetic classification", "Domain theory of ferromagnetism", "Superconductivity"],
          subtopics: ["Dia/Para/Ferromagnetism", "Meissner effect", "BCS theory basics"],
          resources: ["Introduction to Solid State Physics"]
        },
        {
          unit_number: 4,
          title: "Optical Properties of Materials",
          learning_objectives: "Explore laser action and photodiodes.",
          topics: ["Einstein's coefficients", "Semiconductor lasers", "Photodetectors"],
          subtopics: ["Spontaneous and stimulated emission", "PIN photodiode", "Solar cells"],
          resources: ["Optoelectronics and Photonics by Kasap"]
        },
        {
          unit_number: 5,
          title: "Nano-electronic Devices",
          learning_objectives: "Analyze quantum confinement and carbon nanotubes.",
          topics: ["Quantum confinement", "Single electron transistors", "Carbon nanotubes"],
          subtopics: ["Quantum wells, wires, dots", "Coulomb blockade", "CNT applications"],
          resources: ["Nanotechnology by T. Pradeep"]
        }
      ]
    },
    {
      course_code: "GE23131",
      course_name: "Programming using C",
      credits: 3,
      category: "ES",
      description: "Core algorithms, control statements, arrays, functions, pointers, and structures in C.",
      learning_outcomes: ["Write structured C programs", "Implement algorithms using loops and decisions", "Utilize pointers and files"],
      units: [
        {
          unit_number: 1,
          title: "Introduction to C Programming",
          learning_objectives: "Understand C syntax, data types, and operators.",
          topics: ["Structure of C program", "Compilation process", "Data types & Operators"],
          subtopics: ["Identifiers", "Type casting", "Input/Output statements"],
          resources: ["Programming in ANSI C by E. Balagurusamy"]
        },
        {
          unit_number: 2,
          title: "Control Statements and Decision Making",
          learning_objectives: "Apply conditional logic and loops to solve problems.",
          topics: ["If-Else condition", "Switch statement", "Loops (For, While, Do-While)"],
          subtopics: ["Nested conditions", "Break & Continue", "Infinite loops"],
          resources: ["Let Us C by Yashavant Kanetkar"]
        },
        {
          unit_number: 3,
          title: "Arrays and Strings",
          learning_objectives: "Manipulate 1D and 2D arrays, and string operations.",
          topics: ["1D Arrays", "2D Arrays", "String manipulation functions"],
          subtopics: ["Searching & Sorting", "Matrix operations", "strlen, strcpy, strcmp"],
          resources: ["C Programming: A Modern Approach by K.N. King"]
        },
        {
          unit_number: 4,
          title: "Functions and Pointers",
          learning_objectives: "Create modular code and direct memory addresses access.",
          topics: ["Function declaration & definition", "Call by Value vs Reference", "Pointer basics"],
          subtopics: ["Recursion", "Pointer arithmetic", "Dynamic memory allocation (malloc, calloc)"],
          resources: ["Pointers in C by Yashavant Kanetkar"]
        },
        {
          unit_number: 5,
          title: "Structures, Unions, and Files",
          learning_objectives: "Create custom data types and perform file operations.",
          topics: ["Structures", "Unions", "File handling in C"],
          subtopics: ["Nested structures", "fopen, fclose, fread, fwrite", "File pointers"],
          resources: ["The C Programming Language by Kernighan and Ritchie"]
        }
      ]
    },
    {
      course_code: "EE23133",
      course_name: "Basic Electrical and Electronics Engineering",
      credits: 3,
      category: "ES",
      description: "Basics of AC/DC circuits, semiconductor diodes, transistors, and power converters.",
      learning_outcomes: ["Solve basic circuit parameters", "Analyze diode and transistor behavior", "Describe power electronic operations"],
      units: [
        {
          unit_number: 1,
          title: "Electrical Circuits",
          learning_objectives: "Apply Ohm's law, Kirchhoff's laws, and mesh/nodal analysis.",
          topics: ["Ohm's Law", "Kirchhoff's Laws", "Mesh & Nodal Analysis"],
          subtopics: ["DC circuits", "Resistors in series & parallel", "Basic network theorems"],
          resources: ["Electrical Technology by Hughes"]
        },
        {
          unit_number: 2,
          title: "AC Circuits and Transformers",
          learning_objectives: "Understand single-phase and three-phase AC systems.",
          topics: ["AC waveforms", "Power factor", "Single phase transformer"],
          subtopics: ["RMS & Average values", "Active and reactive power", "Transformer working principle"],
          resources: ["Basic Electrical Engineering by D.P. Kothari"]
        },
        {
          unit_number: 3,
          title: "Semiconductor Devices",
          learning_objectives: "Explain PN junction diodes and bipolar junction transistors.",
          topics: ["PN Junction Diode", "Zener Diode", "Bipolar Junction Transistor (BJT)"],
          subtopics: ["Diode characteristics", "Rectifiers", "Transistor configurations (CE, CB, CC)"],
          resources: ["Electronic Devices and Circuit Theory by Boylestad"]
        },
        {
          unit_number: 4,
          title: "Digital Electronics Basics",
          learning_objectives: "Implement boolean algebra and logic gates.",
          topics: ["Number systems", "Logic gates", "Boolean simplification"],
          subtopics: ["Binary addition", "K-maps basics", "Combinational circuits (Adders)"],
          resources: ["Digital Design by Morris Mano"]
        },
        {
          unit_number: 5,
          title: "Electrical Machines and Power Electronics",
          learning_objectives: "Review motors, generators, and thyristors.",
          topics: ["DC Motor", "AC Induction Motor", "Thyristor (SCR)"],
          subtopics: ["Speed-torque characteristics", "Inverters & Choppers", "Applications"],
          resources: ["Power Electronics by P.S. Bimbhra"]
        }
      ]
    },
    {
      course_code: "GE23122",
      course_name: "Engineering Practices – Electrical and Electronics",
      credits: 2,
      category: "ES",
      description: "Hands-on laboratory training on wiring, circuit building, and electronics assembly.",
      learning_outcomes: ["Perform basic domestic electrical wiring", "Measure voltage and current parameters", "Assemble simple electronic layouts"],
      units: [
        {
          unit_number: 1,
          title: "Domestic Wiring",
          learning_objectives: "Perform basic stair-case and parallel light wiring.",
          topics: ["Residential house wiring", "Staircase wiring", "Fluorescent lamp wiring"],
          subtopics: ["Single phase supply", "Fuses and circuit breakers", "Earthing methods"],
          resources: ["Engineering Practices Lab Manual"]
        },
        {
          unit_number: 2,
          title: "Electrical Measurements",
          learning_objectives: "Measure electrical power and energy parameters.",
          topics: ["Energy meter calibration", "Power measurement", "Multimeter utilization"],
          subtopics: ["Single phase power factor", "Current transformer basics", "AC/DC voltage measurement"],
          resources: ["Electrical Laboratory Manual"]
        },
        {
          unit_number: 3,
          title: "Electronic Component Verification",
          learning_objectives: "Identify and test discrete electronic components.",
          topics: ["Resistor color coding", "Diode testing", "Transistor terminal identification"],
          subtopics: ["LCR meter", "Cathode Ray Oscilloscope (CRO) operation", "Signal generator"],
          resources: ["Electronics Lab Manual"]
        },
        {
          unit_number: 4,
          title: "Logic Gate Verification",
          learning_objectives: "Verify truth tables of elementary logic gates.",
          topics: ["AND, OR, NOT gates", "Universal gates (NAND, NOR)", "Exclusive-OR (XOR)"],
          subtopics: ["IC pin diagram", "Breadboard wiring", "Logic probe"],
          resources: ["Digital Lab Experiments"]
        },
        {
          unit_number: 5,
          title: "Printed Circuit Board Assembly",
          learning_objectives: "Solder components onto a PCB board.",
          topics: ["Soldering techniques", "Desoldering", "PCB layout drawing"],
          subtopics: ["Soldering iron, lead", "Etching basics", "Circuit testing"],
          resources: ["PCB Design and Technology"]
        }
      ]
    },
    {
      course_code: "MC23111",
      course_name: "Indian Constitution and Freedom Movement",
      credits: 0,
      category: "MC",
      description: "Mandatory course covering fundamental rights, duties, directive principles, and the freedom struggle.",
      learning_outcomes: ["Understand constitutional hierarchy", "Explain fundamental rights and duties", "Outline freedom struggle milestones"],
      units: [
        {
          unit_number: 1,
          title: "Freedom Movement",
          learning_objectives: "Understand key milestones of the Indian national struggle.",
          topics: ["Revolt of 1857", "Indian National Congress establishment", "Gandhian era"],
          subtopics: ["Non-cooperation movement", "Civil disobedience", "Quit India Movement"],
          resources: ["India's Struggle for Independence by Bipan Chandra"]
        },
        {
          unit_number: 2,
          title: "Constitutional Structure",
          learning_objectives: "Analyze framing of the Indian constitution and Preamble.",
          topics: ["Constituent Assembly", "Drafting committee", "Preamble key terms"],
          subtopics: ["Sovereign, Socialist, Secular", "Democratic, Republic", "Federal structure"],
          resources: ["Introduction to the Constitution of India by D.D. Basu"]
        },
        {
          unit_number: 3,
          title: "Fundamental Rights and Duties",
          learning_objectives: "Evaluate fundamental rights, duties, and directive principles.",
          topics: ["Fundamental Rights", "Directive Principles of State Policy", "Fundamental Duties"],
          subtopics: ["Right to equality", "Right to freedom", "Article 32 remedies"],
          resources: ["Indian Polity by Laxmikanth"]
        },
        {
          unit_number: 4,
          title: "Union Executive and Legislature",
          learning_objectives: "Outline powers of President, Prime Minister, and Parliament.",
          topics: ["President powers", "Prime Minister and Cabinet", "Lok Sabha & Rajya Sabha"],
          subtopics: ["Legislative procedure", "Speaker role", "Executive accountability"],
          resources: ["Our Parliament by Subhash Kashyap"]
        },
        {
          unit_number: 5,
          title: "State Government and Local Bodies",
          learning_objectives: "Contrast state government functions and local panchayat raj.",
          topics: ["Governor duties", "Chief Minister role", "Panchayati Raj (73rd & 74th Amendment)"],
          subtopics: ["State legislature", "District administration", "Municipal corporations"],
          resources: ["Local Government in India"]
        }
      ]
    }
  ],
  2: [
    {
      course_code: "MA23214",
      course_name: "Probability and Inferential Statistics",
      credits: 4,
      category: "BS",
      description: "Probability distributions, hypothesis testing, ANOVA, and estimation theory.",
      learning_outcomes: ["Apply probability distributions", "Perform hypothesis testing", "Analyze variance using ANOVA"],
      units: [
        {
          unit_number: 1,
          title: "Probability Distributions",
          learning_objectives: "Master discrete and continuous distributions.",
          topics: ["Binomial distribution", "Poisson distribution", "Normal distribution"],
          subtopics: ["Mean and Variance", "Moment generating function", "Applications"],
          resources: ["Probability & Statistics for Engineers"]
        },
        {
          unit_number: 2,
          title: "Estimation Theory",
          learning_objectives: "Estimate point and interval parameters.",
          topics: ["Point estimation", "Interval estimation", "Method of maximum likelihood"],
          subtopics: ["Unbiasedness", "Confidence intervals", "Sample size determination"],
          resources: ["Introduction to Mathematical Statistics"]
        },
        {
          unit_number: 3,
          title: "Hypothesis Testing (Large Samples)",
          learning_objectives: "Apply Z-tests to large sample sizes.",
          topics: ["Null and alternative hypothesis", "Z-test for single mean", "Z-test for difference of proportions"],
          subtopics: ["Critical region", "Type I and II errors", "Level of significance"],
          resources: ["Statistical Methods"]
        },
        {
          unit_number: 4,
          title: "Hypothesis Testing (Small Samples)",
          learning_objectives: "Use Student t-test, Chi-square, and F-tests.",
          topics: ["Student t-test", "Chi-square goodness of fit", "F-test for variance ratio"],
          subtopics: ["Paired t-test", "Contingency tables", "Degrees of freedom"],
          resources: ["Fundamentals of Mathematical Statistics"]
        },
        {
          unit_number: 5,
          title: "Design of Experiments (ANOVA)",
          learning_objectives: "Implement one-way and two-way analysis of variance.",
          topics: ["Analysis of Variance (ANOVA)", "One-way classification", "Two-way classification"],
          subtopics: ["Completely Randomized Design", "Randomized Block Design", "F-ratio verification"],
          resources: ["Experimental Designs by Cochran"]
        }
      ]
    },
    {
      course_code: "GE23217",
      course_name: "Tamils and Technology",
      credits: 1,
      category: "HS",
      description: "Ancient engineering, metallurgy, shipbuilding, and textile technology of Tamils.",
      learning_outcomes: ["Describe ancient Tamil metallurgy", "Explain traditional dam and irrigation engineering", "Outline weaving crafts"],
      units: [
        {
          unit_number: 1,
          title: "Weaving and Ceramic Technology",
          learning_objectives: "Explore historical weaving and clay pottery techniques.",
          topics: ["Ancient weaving loom", "Dyeing techniques", "Pottery making in Sangam era"],
          subtopics: ["Kanchipuram silk origins", "Black and red ware", "Terracotta figurines"],
          resources: ["Tamils and Technology by REC Press"]
        },
        {
          unit_number: 2,
          title: "Metallurgy and Iron Technology",
          learning_objectives: "Study wootz steel manufacturing and bronze casting.",
          topics: ["Wootz steel", "Iron smelting furnaces", "Bronze idols casting"],
          subtopics: ["Kodumanal excavations", "Lost wax process", "Corrosion resistance"],
          resources: ["Ancient Metallurgy in Tamil Nadu"]
        },
        {
          unit_number: 3,
          title: "Hydraulics and Agriculture",
          learning_objectives: "Analyze ancient stone dams and agricultural implements.",
          topics: ["Kallanai dam construction", "Stone sluices", "Traditional water storage"],
          subtopics: ["Eri system", "Traditional ploughs", "Soil classification"],
          resources: ["Water Management in Ancient Tamil Nadu"]
        },
        {
          unit_number: 4,
          title: "Shipbuilding and Navigation",
          learning_objectives: "Examine boat architectures and maritime routes.",
          topics: ["Ship building wood choice", "Catamaran origins", "Navigational astronomy"],
          subtopics: ["Wind directions naming", "Kala Thoni", "Port infrastructures"],
          resources: ["Maritime Heritage of Tamils"]
        },
        {
          unit_number: 5,
          title: "Architecture and Town Planning",
          learning_objectives: "Understand rock cut temples and historic fortresses.",
          topics: ["Rock cut temples", "Structural temples", "Town layouts of Madurai & Kaveripoompattinam"],
          subtopics: ["Vastu Shastra adaptations", "Aesthetic proportions", "Fortifications"],
          resources: ["Temple Architecture of South India"]
        }
      ]
    },
    {
      course_code: "GE23111",
      course_name: "Engineering Graphics",
      credits: 3,
      category: "ES",
      description: "Orthographic projections, isometric views, sectioning, and CAD drawing standards.",
      learning_outcomes: ["Draw orthographic projections", "Construct isometric drawings", "Use CAD tools for design drawing"],
      units: [
        {
          unit_number: 1,
          title: "Curves used in Engineering Practices",
          learning_objectives: "Construct conics, cycloids, and involutes.",
          topics: ["Ellipse, Parabola, Hyperbola", "Cycloid & Epicycloid", "Involute of circle & polygon"],
          subtopics: ["Focus-directrix method", "Normal and tangent drawing", "Practical applications"],
          resources: ["Engineering Drawing by N.D. Bhatt"]
        },
        {
          unit_number: 2,
          title: "Orthographic Projections",
          learning_objectives: "Project points, lines, and plane surfaces.",
          topics: ["First angle projection", "Projection of points & lines", "Projection of planes (polygons, circles)"],
          subtopics: ["True length & inclinations", "Auxiliary plane method", "Rotational method"],
          resources: ["Engineering Graphics by REC Press"]
        },
        {
          unit_number: 3,
          title: "Projection of Solids",
          learning_objectives: "Construct projections of prisms, cylinders, pyramids, cones.",
          topics: ["Prisms and Pyramids", "Cylinders and Cones", "Axis inclined to one reference plane"],
          subtopics: ["Hexagonal prism", "Triangular pyramid", "Frustum projections"],
          resources: ["Engineering Drawing"]
        },
        {
          unit_number: 4,
          title: "Section of Solids and Development of Surfaces",
          learning_objectives: "Section solids and unfold outer shell surfaces.",
          topics: ["Section planes", "True shape of section", "Development of lateral surfaces"],
          subtopics: ["Prism sectioning", "Radial line development", "Parallel line development"],
          resources: ["Machine Drawing by Gopalakrishna"]
        },
        {
          unit_number: 5,
          title: "Isometric and Perspective Projections",
          learning_objectives: "Create three-dimensional isometric views.",
          topics: ["Isometric scale", "Isometric projection of simple solids", "Perspective projection basics"],
          subtopics: ["Box method", "Composite solids", "Visual ray method"],
          resources: ["Engineering Graphics Lab Manual"]
        }
      ]
    },
    {
      course_code: "IT23231",
      course_name: "Digital Principles and Computer Architecture",
      credits: 3,
      category: "ES",
      description: "Registers, ALU, computer organization, pipelining, and memory hierarchy.",
      learning_outcomes: ["Design combinational logic", "Differentiate computer instruction formats", "Explain pipeline architectures"],
      units: [
        {
          unit_number: 1,
          title: "Combinational and Sequential Logic",
          learning_objectives: "Implement multiplexers, encoders, and flip-flops.",
          topics: ["Decoders & Encoders", "Multiplexers", "Flip-Flops (SR, JK, D, T)"],
          subtopics: ["Boolean reduction", "Counters design", "Shift registers"],
          resources: ["Digital Principles and Applications by Malvino & Leach"]
        },
        {
          unit_number: 2,
          title: "Computer Instructions and CPU",
          learning_objectives: "Understand register transfer, bus structures, and execution.",
          topics: ["Instruction codes", "Computer registers", "Instruction cycle"],
          subtopics: ["Memory reference instructions", "Input-Output configuration", "Interrupt cycle"],
          resources: ["Computer System Architecture by M. Morris Mano"]
        },
        {
          unit_number: 3,
          title: "Microprogrammed Control Unit",
          learning_objectives: "Compare hardwired control vs microprogrammed control.",
          topics: ["Control memory", "Address sequencing", "Microinstruction format"],
          subtopics: ["Conditional branching", "Subroutines", "Microprogram sequencer"],
          resources: ["Computer Organization by Hamacher"]
        },
        {
          unit_number: 4,
          title: "Arithmetic Operations and Pipelining",
          learning_objectives: "Implement multiplication algorithms and pipelining.",
          topics: ["Booth's algorithm", "Arithmetic pipeline", "Instruction pipeline"],
          subtopics: ["Binary division", "Hazard mitigation", "RISC pipeline"],
          resources: ["Computer Organization and Design by Patterson & Hennessy"]
        },
        {
          unit_number: 5,
          title: "Memory Organization and I/O",
          learning_objectives: "Master cache mapping, virtual memory, and DMA.",
          topics: ["Memory hierarchy", "Cache memory mapping", "Direct Memory Access (DMA)"],
          subtopics: ["Associative cache", "Virtual memory page tables", "I/O processors"],
          resources: ["Structured Computer Organization by Tanenbaum"]
        }
      ]
    },
    {
      course_code: "AI23231",
      course_name: "Principles of Artificial Intelligence",
      credits: 3,
      category: "PC",
      description: "Search algorithms, knowledge representation, logic, planning, and uncertainty.",
      learning_outcomes: ["Apply search algorithms", "Represent knowledge using logic", "Handle probabilistic reasoning"],
      units: [
        {
          unit_number: 1,
          title: "Problem Solving by Searching",
          learning_objectives: "Understand heuristic search and search strategies.",
          topics: ["Breadth-first search", "Depth-first search", "A* search & Heuristics"],
          subtopics: ["Uninformed vs Informed search", "Admissibility", "Constraint Satisfaction Problems"],
          resources: ["Artificial Intelligence: A Modern Approach by Russell & Norvig"]
        },
        {
          unit_number: 2,
          title: "Game Playing and Adversarial Search",
          learning_objectives: "Optimize decision trees in competitive settings.",
          topics: ["Minimax algorithm", "Alpha-Beta pruning", "Stochastic games"],
          subtopics: ["Evaluation functions", "Monte Carlo Tree Search", "Game theory basics"],
          resources: ["AI: A Modern Approach"]
        },
        {
          unit_number: 3,
          title: "Knowledge Representation and Logic",
          learning_objectives: "Apply first-order logic to represent facts.",
          topics: ["Propositional logic", "First-order predicate logic", "Resolution refutation"],
          subtopics: ["Unification", "Semantic networks", "Frames & Ontologies"],
          resources: ["Knowledge Representation and Reasoning by Brachman"]
        },
        {
          unit_number: 4,
          title: "Planning and Reasoning",
          learning_objectives: "Synthesize actions to achieve goals.",
          topics: ["Classical planning", "STRIPS representation", "Partial order planning"],
          subtopics: ["Planning graphs", "Hierarchical planning", "Multi-agent planning"],
          resources: ["Artificial Intelligence by Rich & Knight"]
        },
        {
          unit_number: 5,
          title: "Probabilistic Reasoning",
          learning_objectives: "Solve problems under uncertainty using Bayes nets.",
          topics: ["Bayesian networks", "Conditional independence", "Markov models"],
          subtopics: ["Probability axioms", "Inference in belief networks", "Hidden Markov Models"],
          resources: ["Probabilistic Reasoning in Intelligent Systems by Pearl"]
        }
      ]
    },
    {
      course_code: "CS23231",
      course_name: "Data Structures",
      credits: 3,
      category: "PC",
      description: "Linear and non-linear data structures: lists, stacks, queues, trees, graphs, sorting and hashing.",
      learning_outcomes: ["Implement stacks and queues", "Construct and traverse binary trees", "Apply graph algorithms"],
      units: [
        {
          unit_number: 1,
          title: "Linear Data Structures",
          learning_objectives: "Implement dynamic lists, stacks, and queues.",
          topics: ["Singly Linked List", "Stack ADT (Array & List)", "Queue ADT (Circular Queue)"],
          subtopics: ["Doubly linked list", "Infix to Postfix conversion", "Queue applications"],
          resources: ["Data Structures and Algorithm Analysis in C++ by Weiss"]
        },
        {
          unit_number: 2,
          title: "Non-Linear Structures: Trees",
          learning_objectives: "Construct BST, AVL, and heap structures.",
          topics: ["Binary Search Tree (BST)", "AVL Tree", "Binary Heaps"],
          subtopics: ["Tree traversals", "AVL rotations", "Heapify & Priority queues"],
          resources: ["Classic Data Structures by Samanta"]
        },
        {
          unit_number: 3,
          title: "Non-Linear Structures: Graphs",
          learning_objectives: "Traverse graphs and find shortest paths.",
          topics: ["Adjacency Matrix & List", "Depth First Search (DFS)", "Dijkstra's Algorithm"],
          subtopics: ["Breadth First Search (BFS)", "Prim's & Kruskal's algorithms", "Topological sort"],
          resources: ["Introduction to Algorithms by Cormen"]
        },
        {
          unit_number: 4,
          title: "Sorting and Searching Techniques",
          learning_objectives: "Analyze time complexities of sorting routines.",
          topics: ["Quick Sort", "Merge Sort", "Binary Search"],
          subtopics: ["Pivot selection", "Divide and conquer", "Insertion & Shell sort"],
          resources: ["Algorithms by Sedgewick"]
        },
        {
          unit_number: 5,
          title: "Hashing and Collisions",
          learning_objectives: "Design collision resolution strategies.",
          topics: ["Hash functions", "Chaining", "Open addressing (Linear Probing)"],
          subtopics: ["Quadratic probing", "Double hashing", "Rehashing & Load factor"],
          resources: ["Data Structures Using C by Tanenbaum"]
        }
      ]
    },
    {
      course_code: "HS23221",
      course_name: "Technical Communication II",
      credits: 3,
      category: "HS",
      description: "Advanced report writing, presentation delivery, group discussion strategies.",
      learning_outcomes: ["Draft technical reports", "Deliver academic presentations", "Participate in job interviews"],
      units: [
        {
          unit_number: 1,
          title: "Advanced Grammar and Vocabulary",
          learning_objectives: "Enhance vocabulary for formal expressions.",
          topics: ["Collocations", "Idiomatic expressions", "Sentence reconstruction"],
          subtopics: ["Active/Passive transformation", "Formal synonyms", "Punctuation precision"],
          resources: ["English Vocabulary in Use"]
        },
        {
          unit_number: 2,
          title: "Technical Writing and Reporting",
          learning_objectives: "Draft technical project reports.",
          topics: ["Report structure", "Abstract writing", "Feasibility reports"],
          subtopics: ["Executive summary", "Data interpretation", "Bibliography style"],
          resources: ["Technical Communication by Raman & Sharma"]
        },
        {
          unit_number: 3,
          title: "Presentation Skills",
          learning_objectives: "Deliver structured slide-based presentations.",
          topics: ["Slide design", "Speech delivery", "Audience management"],
          subtopics: ["Body language", "Visual representation of data", "Q&A session strategies"],
          resources: ["Presentation Zen"]
        },
        {
          unit_number: 4,
          title: "Group Discussions and Interview Prep",
          learning_objectives: "Demonstrate teamwork in group discussions.",
          topics: ["GD etiquette", "Mock interviews", "Resume preparation"],
          subtopics: ["Leadership signals", "Answering behavior questions", "Formatting CVs"],
          resources: ["GD and Interview Guide"]
        },
        {
          unit_number: 5,
          title: "Professional Correspondence",
          learning_objectives: "Draft cover letters and project proposals.",
          topics: ["Cover letters", "E-mail writing guidelines", "Project proposals format"],
          subtopics: ["Tone adjustment", "Formatting headers", "Action plans"],
          resources: ["Business Writing That Works"]
        }
      ]
    },
    {
      course_code: "GE23121",
      course_name: "Engineering Practices – Civil and Mechanical",
      credits: 2,
      category: "ES",
      description: "Laboratory practice in carpentry, plumbing, welding, sheet metal operations.",
      learning_outcomes: ["Construct basic carpentry joints", "Execute simple welding joints", "Layout plumbing connections"],
      units: [
        {
          unit_number: 1,
          title: "Carpentry Shop",
          learning_objectives: "Perform basic wood sawing and joinery.",
          topics: ["Wood selection", "T-Joint", "Mortise and Tenon joint"],
          subtopics: ["Planning", "Chiseling", "Safety protocols"],
          resources: ["Carpentry Practice Manual"]
        },
        {
          unit_number: 2,
          title: "Plumbing Shop",
          learning_objectives: "Assemble pipe joints and valves.",
          topics: ["G.I. pipes & PVC connections", "Tap connections", "Valves installation"],
          subtopics: ["Thread cutting", "Adhesives utilization", "Layout planning"],
          resources: ["Plumbing Practice Handbook"]
        },
        {
          unit_number: 3,
          title: "Welding Shop",
          learning_objectives: "Perform arc welding of metal plates.",
          topics: ["Arc welding", "Butt joint", "Lap joint"],
          subtopics: ["Welding current settings", "Electrode choice", "Welding shield use"],
          resources: ["Workshop Practices"]
        },
        {
          unit_number: 4,
          title: "Sheet Metal Shop",
          learning_objectives: "Form trays and cylinders using sheet metal.",
          topics: ["Metal shearing", "Bending operations", "Tray making"],
          subtopics: ["Cone development layout", "Soldering seams", "Safety gloves usage"],
          resources: ["Sheet Metal Work Manual"]
        },
        {
          unit_number: 5,
          title: "Fitting Shop",
          learning_objectives: "File and join metal blanks.",
          topics: ["Filing practice", "V-Joint", "Square joint"],
          subtopics: ["Vernier caliper measurement", "Hack sawing", "Tapping and dieing"],
          resources: ["Fitting Practice Guide"]
        }
      ]
    },
    {
      course_code: "CS23221",
      course_name: "Python Programming Lab",
      credits: 2,
      category: "ES",
      description: "Coding experiments with Python: control flow, lists, files, exception handling, data science basics.",
      learning_outcomes: ["Write Python scripts", "Manipulate lists and files", "Use numpy/pandas modules"],
      units: [
        {
          unit_number: 1,
          title: "Python Basics and Control Flow",
          learning_objectives: "Master python syntax and basic structures.",
          topics: ["Variables & Operators", "If-Else conditions", "Loops (While & For)"],
          subtopics: ["Indentation", "List comprehensions", "Range function"],
          resources: ["Python Crash Course"]
        },
        {
          unit_number: 2,
          title: "Data Structures in Python",
          learning_objectives: "Use tuples, dictionaries, lists, and sets.",
          topics: ["List operations", "Dictionary key-value pairs", "Tuples & Sets"],
          subtopics: ["Slicing", "Sorting collections", "Mutable vs Immutable types"],
          resources: ["Fluent Python"]
        },
        {
          unit_number: 3,
          title: "Functions and Modules",
          learning_objectives: "Write modular code and load core modules.",
          topics: ["Def keyword", "Lambda functions", "Importing packages"],
          subtopics: ["Positional & keyword arguments", "Math, Random modules", "Custom module creation"],
          resources: ["Learning Python by Mark Lutz"]
        },
        {
          unit_number: 4,
          title: "File Operations and Exception Handling",
          learning_objectives: "Read/write external files and handle runtime failures.",
          topics: ["Open, Read, Write functions", "Try-Except-Finally blocks", "Context managers (with)"],
          subtopics: ["CSV file parsing", "Custom exceptions", "Assert statement"],
          resources: ["Python Cookbook"]
        },
        {
          unit_number: 5,
          title: "Data Analysis Libraries",
          learning_objectives: "Use numpy arrays and pandas dataframes.",
          topics: ["Numpy ndarray", "Pandas DataFrames", "Matplotlib plots"],
          subtopics: ["Matrix arithmetic", "Filter rows in DataFrame", "Line and bar charts"],
          resources: ["Python for Data Analysis by McKinney"]
        }
      ]
    }
  ],
  3: [
    {
      course_code: "MA23313",
      course_name: "Discrete Mathematics for AI",
      credits: 4,
      category: "BS",
      description: "Mathematical logic, sets, relations, combinatorics, graph theory, algebraic systems.",
      learning_outcomes: ["Verify logical arguments", "Apply pigeonhole principle", "Perform graph coloring"],
      units: [
        {
          unit_number: 1,
          title: "Mathematical Logic",
          learning_objectives: "Analyze propositions, truth tables, and predicates.",
          topics: ["Propositional logic", "Tautologies", "Normal forms"],
          subtopics: ["Rules of inference", "Predicate calculus", "Quantifiers"],
          resources: ["Discrete Mathematics by Rosen"]
        },
        {
          unit_number: 2,
          title: "Combinatorics and Counting",
          learning_objectives: "Solve permutation and combination problems.",
          topics: ["Permutations", "Combinations", "Pigeonhole principle"],
          subtopics: ["Inclusion-exclusion principle", "Recurrence relations", "Generating functions"],
          resources: ["Introductory Combinatorics"]
        },
        {
          unit_number: 3,
          title: "Relations and Functions",
          learning_objectives: "Evaluate properties of relations and equivalence partitions.",
          topics: ["Equivalence relations", "Partial ordering", "Lattices & Hasse diagrams"],
          subtopics: ["Transitive closure", "Warshall's algorithm", "Bijective functions"],
          resources: ["Elements of Discrete Mathematics"]
        },
        {
          unit_number: 4,
          title: "Graph Theory",
          learning_objectives: "Model problems using trees and graphs.",
          topics: ["Graph isomorphism", "Euler and Hamiltonian paths", "Graph coloring"],
          subtopics: ["Planar graphs", "Shortest path routing", "Tree traversals"],
          resources: ["Introduction to Graph Theory by West"]
        },
        {
          unit_number: 5,
          title: "Algebraic Structures",
          learning_objectives: "Define groups, rings, and fields.",
          topics: ["Groups & Subgroups", "Cosets & Lagrange theorem", "Rings and Fields"],
          subtopics: ["Homomorphism", "Normal subgroups", "Coding theory applications"],
          resources: ["Topics in Algebra by Herstein"]
        }
      ]
    },
    {
      course_code: "AI23331",
      course_name: "Fundamentals of Machine Learning",
      credits: 4,
      category: "PC",
      description: "Supervised and unsupervised learning, regression, decision trees, support vector machines, and clustering.",
      learning_outcomes: ["Implement linear and logistic regressions", "Build decision tree models", "Evaluate models using cross-validation"],
      units: [
        {
          unit_number: 1,
          title: "Linear and Logistic Regression",
          learning_objectives: "Apply regression models to predict numeric and binary targets.",
          topics: ["Gradient Descent", "Linear regression cost function", "Logistic regression classification"],
          subtopics: ["L1 and L2 regularization", "Multiclass classification", "Learning curves"],
          resources: ["Pattern Recognition and Machine Learning by Bishop"]
        },
        {
          unit_number: 2,
          title: "Decision Trees and Ensemble Methods",
          learning_objectives: "Build tree-based architectures and random forests.",
          topics: ["Information Gain & Entropy", "Random Forests", "Gradient Boosting"],
          subtopics: ["Pruning", "Gini index", "AdaBoost & XGBoost"],
          resources: ["Introduction to Statistical Learning"]
        },
        {
          unit_number: 3,
          title: "Support Vector Machines",
          learning_objectives: "Apply margins and kernel tricks to complex boundaries.",
          topics: ["Linear SVM", "Kernel Trick", "Soft Margin classification"],
          subtopics: ["Dual formulation", "RBF kernel", "Support vectors identification"],
          resources: ["Learning from Data"]
        },
        {
          unit_number: 4,
          title: "Clustering and Dimensionality Reduction",
          learning_objectives: "Group unlabelled points and compress features.",
          topics: ["K-Means clustering", "Principal Component Analysis (PCA)", "Hierarchical clustering"],
          subtopics: ["Elbow method", "Eigenvalue decomposition", "DBSCAN clustering"],
          resources: ["Data Mining: Concepts and Techniques"]
        },
        {
          unit_number: 5,
          title: "Model Evaluation and Metrics",
          learning_objectives: "Assess classifiers and regressors quantitatively.",
          topics: ["Confusion Matrix", "ROC-AUC curves", "K-Fold Cross-validation"],
          subtopics: ["Precision-Recall trade-off", "MSE, R-Squared", "F1 Score"],
          resources: ["Applied Predictive Modeling"]
        }
      ]
    },
    {
      course_code: "CS23331",
      course_name: "Design and Analysis of Algorithms",
      credits: 4,
      category: "PC",
      description: "Analysis of time complexity, divide and conquer, dynamic programming, greedy methods, and NP-completeness.",
      learning_outcomes: ["Analyze asymptotic time complexity", "Apply dynamic programming", "Identify NP-complete challenges"],
      units: [
        {
          unit_number: 1,
          title: "Introduction and Divide & Conquer",
          learning_objectives: "Understand Big-O, Master theorem, and binary division algorithms.",
          topics: ["Asymptotic notations", "Master Theorem", "Binary search and Merge sort"],
          subtopics: ["Recurrence relations", "Worst-case analysis", "Quick sort partition"],
          resources: ["Introduction to Algorithms by CLRS"]
        },
        {
          unit_number: 2,
          title: "Greedy Technique",
          learning_objectives: "Solve optimization tasks using greedy choice.",
          topics: ["Fractional Knapsack", "Kruskal's MST", "Huffman coding"],
          subtopics: ["Optimal storage", "Prim's tree", "Job sequencing"],
          resources: ["Algorithm Design by Kleinberg & Tardos"]
        },
        {
          unit_number: 3,
          title: "Dynamic Programming",
          learning_objectives: "Formulate recurrence and state tables.",
          topics: ["0/1 Knapsack", "Longest Common Subsequence (LCS)", "Floyd-Warshall algorithm"],
          subtopics: ["Matrix chain multiplication", "Memoization vs Tabulation", "Optimal binary trees"],
          resources: ["Algorithms by Dasgupta"]
        },
        {
          unit_number: 4,
          title: "Backtracking and Branch & Bound",
          learning_objectives: "Search state space trees for optimal layouts.",
          topics: ["N-Queens problem", "Traveling Salesperson Problem", "Graph coloring"],
          subtopics: ["State-space representation", "Bounding functions", "Hamiltonian cycles"],
          resources: ["Fundamentals of Computer Algorithms"]
        },
        {
          unit_number: 5,
          title: "NP Completeness and Approximation",
          learning_objectives: "Differentiate P, NP, NP-Hard, and NP-Complete.",
          topics: ["P and NP classes", "Polynomial reduction", "NP-Complete definition"],
          subtopics: ["Vertex Cover", "Approximation ratio", "Heuristic bounds"],
          resources: ["Computers and Intractability by Garey & Johnson"]
        }
      ]
    },
    {
      course_code: "CS23332",
      course_name: "Database Management Systems",
      credits: 3,
      category: "PC",
      description: "SQL, relational algebra, normalizations, transactions, locking, and NoSQL structures.",
      learning_outcomes: ["Write SQL queries", "Apply normalization rules", "Explain ACID transaction safety"],
      units: [
        {
          unit_number: 1,
          title: "Relational Model and SQL",
          learning_objectives: "Create relational tables and write join operations.",
          topics: ["ER Diagrams", "Relational Algebra", "SQL Select & Join statements"],
          subtopics: ["Primary and Foreign keys", "Aggregate functions", "Nested queries"],
          resources: ["Database System Concepts by Silberschatz"]
        },
        {
          unit_number: 2,
          title: "Normalization",
          learning_objectives: "Apply normal forms to remove redundancy anomalies.",
          topics: ["Functional dependency", "First & Second normal form (1NF, 2NF)", "Third & Boyce-Codd normal form (3NF, BCNF)"],
          subtopics: ["Lossless join decomposition", "Dependency preservation", "Multi-valued dependency"],
          resources: ["Fundamentals of Database Systems by Elmasri"]
        },
        {
          unit_number: 3,
          title: "Transaction and Concurrency Control",
          learning_objectives: "Ensure transaction isolation using locking.",
          topics: ["ACID Properties", "Conflict Serializability", "Two-Phase Locking (2PL)"],
          subtopics: ["Deadlock prevention", "Isolation levels", "Transaction states"],
          resources: ["Database Management Systems by Ramakrishnan"]
        },
        {
          unit_number: 4,
          title: "Recovery and Indexing",
          learning_objectives: "Apply log recovery and B-Tree indexes.",
          topics: ["Log-based recovery", "Shadow paging", "B+ Tree Indexing"],
          subtopics: ["Checkpoints", "Primary vs Secondary indexes", "Hash indexing"],
          resources: ["Database Systems: The Complete Book"]
        },
        {
          unit_number: 5,
          title: "NoSQL Databases",
          learning_objectives: "Contrast SQL relational model with key-value and document databases.",
          topics: ["NoSQL characteristics", "Document database (MongoDB)", "CAP Theorem"],
          subtopics: ["Key-value stores", "Sharding & Replication", "Graph databases"],
          resources: ["NoSQL Distilled by Pramod Sadalage"]
        }
      ]
    },
    {
      course_code: "CS23333",
      course_name: "Object Oriented Programming Using JAVA",
      credits: 3,
      category: "PC",
      description: "Classes, inheritance, packages, interfaces, exception handling, multithreading, and event loops.",
      learning_outcomes: ["Develop classes in Java", "Utilize inheritance and interfaces", "Implement multi-threaded processes"],
      units: [
        {
          unit_number: 1,
          title: "Java Basics and OOP Principles",
          learning_objectives: "Understand encapsulation, classes, and constructor systems.",
          topics: ["JVM architecture", "Classes and Objects", "Constructor overloading"],
          subtopics: ["Garbage collection", "Static keyword", "Array of objects"],
          resources: ["Java: The Complete Reference by Herbert Schildt"]
        },
        {
          unit_number: 2,
          title: "Inheritance and Polymorphism",
          learning_objectives: "Extend parent classes and override methods dynamically.",
          topics: ["Super keyword", "Method overriding", "Abstract classes & Interfaces"],
          subtopics: ["Dynamic method dispatch", "Multiple inheritance in Java", "Final class"],
          resources: ["Core Java for the Impatient"]
        },
        {
          unit_number: 3,
          title: "Packages and Exception Handling",
          learning_objectives: "Structure Java programs and handle run-time exceptions.",
          topics: ["Custom Packages", "Try-catch-finally blocks", "Throw & Throws keywords"],
          subtopics: ["Access modifiers", "User-defined exceptions", "Built-in Exceptions list"],
          resources: ["Thinking in Java by Bruce Eckel"]
        },
        {
          unit_number: 4,
          title: "Multithreading and I/O",
          learning_objectives: "Run parallel executions and synchronize shared variables.",
          topics: ["Thread class vs Runnable interface", "Thread lifecycle", "Synchronization"],
          subtopics: ["Inter-thread communication", "File Reader and Writer streams", "Byte streams"],
          resources: ["Effective Java by Joshua Bloch"]
        },
        {
          unit_number: 5,
          title: "Generics and Collections",
          learning_objectives: "Utilize utility collections: lists, maps, sets.",
          topics: ["Generic classes", "ArrayList & LinkedList", "HashMap & HashSet"],
          subtopics: ["Iterator interface", "Comparable & Comparator", "Serialization"],
          resources: ["Java Collections Framework Guide"]
        }
      ]
    },
    {
      course_code: "MC23112",
      course_name: "Environmental Science and Engineering",
      credits: 0,
      category: "MC",
      description: "Ecosystems, biodiversity conservation, pollution control, global warming, and environmental laws.",
      learning_outcomes: ["Identify pollution threats", "Recommend recycling pathways", "Describe local ecosystem structures"],
      units: [
        {
          unit_number: 1,
          title: "Ecosystems and Biodiversity",
          learning_objectives: "Understand ecological pyramids and hot-spots of biodiversity.",
          topics: ["Food chains & webs", "Ecological succession", "Endangered species of India"],
          subtopics: ["Energy flow in ecosystems", "Ex-situ & In-situ conservation", "Hotspots"],
          resources: ["Environmental Studies by Erach Bharucha"]
        },
        {
          unit_number: 2,
          title: "Environmental Pollution",
          learning_objectives: "Review air, water, and solid waste pollution control.",
          topics: ["Air pollution control", "Water treatment", "Solid waste management"],
          subtopics: ["Particulate control devices", "Sewage treatment plant", "Hazardous waste recycling"],
          resources: ["Environmental Pollution Control Engineering"]
        },
        {
          unit_number: 3,
          title: "Natural Resources",
          learning_objectives: "Contrast renewable and non-renewable energies.",
          topics: ["Deforestation causes", "Water resources utilization", "Solar and Wind energy"],
          subtopics: ["Over-exploitation", "Dams advantages & problems", "Biomass energy"],
          resources: ["Renewable Energy Sources"]
        },
        {
          unit_number: 4,
          title: "Social Issues and Climate Change",
          learning_objectives: "Describe greenhouse effect, acid rain, and ozone depletion.",
          topics: ["Greenhouse effect", "Acid rain & Ozone layer", "Disaster management (Earthquake, Flood)"],
          subtopics: ["Global warming mitigation", "Rainwater harvesting", "Resettlement issues"],
          resources: ["Environmental Science by Cunningham"]
        },
        {
          unit_number: 5,
          title: "Human Population and Laws",
          learning_objectives: "Analyze environment protection acts.",
          topics: ["Population growth rates", "Environment Protection Act", "Air & Water prevention acts"],
          subtopics: ["Family welfare program", "E-waste regulations", "Role of IT in environment"],
          resources: ["Environmental Law Handbook"]
        }
      ]
    }
  ],
  4: [
    {
      course_code: "OE23401",
      course_name: "Open Elective I",
      credits: 3,
      category: "OE",
      description: "Introductory course in allied disciplines selected by student.",
      learning_outcomes: ["Understand cross-disciplinary applications", "Apply core elective models"],
      units: [
        {
          unit_number: 1,
          title: "Fundamentals of Open Subject",
          learning_objectives: "Basic parameters of the elective course.",
          topics: ["Overview", "Basic variables", "Standard terminology"],
          subtopics: ["Liaison methods", "Analytical overview"],
          resources: ["Elective Courseware"]
        },
        {
          unit_number: 2,
          title: "Core Mechanics",
          learning_objectives: "Operational workflow of chosen elective.",
          topics: ["Processes", "Frameworks", "Systems"],
          subtopics: ["Flow chart", "System inputs"],
          resources: ["Elective Courseware Vol II"]
        },
        {
          unit_number: 3,
          title: "Practical Integrations",
          learning_objectives: "Connect elective tools to mainstream fields.",
          topics: ["Case studies", "Integration tools", "Protocols"],
          subtopics: ["API mapping", "Cross validations"],
          resources: ["Modern Electives Review"]
        },
        {
          unit_number: 4,
          title: "Testing and Evaluation",
          learning_objectives: "Evaluate efficiency and accuracy of parameters.",
          topics: ["Evaluation criteria", "Statistical testing", "Audit trails"],
          subtopics: ["Standard deviations", "Performance graphs"],
          resources: ["Auditing Systems"]
        },
        {
          unit_number: 5,
          title: "Advanced Case Studies",
          learning_objectives: "Review research trends in chosen elective.",
          topics: ["Recent publications", "Global frameworks", "Future scope"],
          subtopics: ["Industry 5.0 implications", "Ethical bounds"],
          resources: ["Future Trends Journal"]
        }
      ]
    },
    {
      course_code: "MA23434",
      course_name: "Optimization Techniques for AI",
      credits: 3,
      category: "BS",
      description: "Linear programming, simplex method, convex optimization, duality, and heuristic search optimization.",
      learning_outcomes: ["Solve LPP using Simplex", "Describe convex functions", "Formulate dual optimization structures"],
      units: [
        {
          unit_number: 1,
          title: "Linear Programming Problems",
          learning_objectives: "Formulate LPP and resolve using graphical methods.",
          topics: ["LPP formulation", "Graphical method", "Simplex method"],
          subtopics: ["Big-M method", "Two-Phase simplex", "Degeneracy"],
          resources: ["Operations Research by Taha"]
        },
        {
          unit_number: 2,
          title: "Duality and Sensitivity Analysis",
          learning_objectives: "Formulate dual equations from primal systems.",
          topics: ["Primal-Dual relationships", "Dual simplex method", "Sensitivity analysis"],
          subtopics: ["Economic interpretation", "Shadow prices", "Right-hand side changes"],
          resources: ["Linear Programming by Hadley"]
        },
        {
          unit_number: 3,
          title: "Convex Optimization",
          learning_objectives: "Verify convexity and solve unconstrained minimization tasks.",
          topics: ["Convex sets and functions", "Sub-gradients", "Gradient descent optimization"],
          subtopics: ["Convex hull", "Hessian matrix", "Newton's method"],
          resources: ["Convex Optimization by Boyd & Vandenberghe"]
        },
        {
          unit_number: 4,
          title: "Constrained Optimization and KKT",
          learning_objectives: "Solve equality and inequality constraints using KKT conditions.",
          topics: ["Lagrangian formulation", "KKT conditions", "Quadratic programming"],
          subtopics: ["Saddle points", "Interior point method", "Dual ascent"],
          resources: ["Numerical Optimization by Nocedal"]
        },
        {
          unit_number: 5,
          title: "Heuristic and Evolutionary Optimization",
          learning_objectives: "Search global spaces using genetic and swarm algorithms.",
          topics: ["Genetic Algorithms (GA)", "Particle Swarm Optimization (PSO)", "Simulated Annealing"],
          subtopics: ["Selection, Crossover, Mutation", "Velocity update equations", "Cooling schedules"],
          resources: ["Optimization for Engineering Design"]
        }
      ]
    },
    {
      course_code: "AI23431",
      course_name: "Web Technology and Mobile Application",
      credits: 3,
      category: "PC",
      description: "HTML5, CSS3, Javascript, Node.js, Express, React, Android Studio, and React Native basics.",
      learning_outcomes: ["Create responsive pages using CSS", "Build Express APIs", "Develop simple Android applications"],
      units: [
        {
          unit_number: 1,
          title: "Frontend Basics (HTML5, CSS3, JS)",
          learning_objectives: "Structure layouts, styles, and dynamic events.",
          topics: ["HTML5 semantic tags", "CSS Flexbox & Grid", "Javascript ES6 functions"],
          subtopics: ["Form validation", "CSS media queries", "DOM manipulation"],
          resources: ["HTML & CSS by Jon Duckett"]
        },
        {
          unit_number: 2,
          title: "Backend Frameworks (Node.js & Express)",
          learning_objectives: "Handle server requests and route endpoints.",
          topics: ["Node.js event loop", "Express Routing", "RESTful API creation"],
          subtopics: ["Middleware functions", "JSON response", "CORS policy"],
          resources: ["Web Development with Node & Express"]
        },
        {
          unit_number: 3,
          title: "React Framework",
          learning_objectives: "Create modular single-page architectures.",
          topics: ["React components", "State & Props", "Hooks (useEffect, useState)"],
          subtopics: ["Virtual DOM", "React Router", "Context API state"],
          resources: ["Fullstack React"]
        },
        {
          unit_number: 4,
          title: "Mobile App Development",
          learning_objectives: "Layout layouts in Android Studio.",
          topics: ["Android Studio installation", "Activity lifecycle", "Android layouts & Views"],
          subtopics: ["XML layouts", "Intent transfers", "RecyclerView setup"],
          resources: ["Android Programming by Big Nerd Ranch"]
        },
        {
          unit_number: 5,
          title: "Cross Platform Mobile Apps",
          learning_objectives: "Build cross-platform Android/iOS layouts using React Native.",
          topics: ["React Native structure", "Flexbox in React Native", "State management in apps"],
          subtopics: ["Expo CLI", "Native components", "AsyncStorage database"],
          resources: ["React Native in Action"]
        }
      ]
    },
    {
      course_code: "AD23431",
      course_name: "Statistical Analysis and Computing",
      credits: 3,
      category: "PC",
      description: "Data summaries, R programming, sampling distributions, confidence bounds, regression diagnostics.",
      learning_outcomes: ["Write R scripts for descriptive summaries", "Verify normality assumptions", "Interpret ANOVA results in computing models"],
      units: [
        {
          unit_number: 1,
          title: "Exploratory Data Analysis in R",
          learning_objectives: "Compute summaries, plots, and standard deviations.",
          topics: ["R installation & basics", "Data frames manipulation", "GGPlot2 visualization"],
          subtopics: ["Box plots", "Standard deviation & variance", "Missing data cleaning"],
          resources: ["R for Data Science by Wickham"]
        },
        {
          unit_number: 2,
          title: "Sampling and Confidence Intervals",
          learning_objectives: "Differentiate sampling methods and construct confidence limits.",
          topics: ["Central Limit Theorem", "Stratified sampling", "Confidence intervals estimation"],
          subtopics: ["Standard error calculation", "T-score vs Z-score bounds", "Bootstrap intervals"],
          resources: ["Mathematical Statistics with Applications"]
        },
        {
          unit_number: 3,
          title: "Parametric and Non-Parametric Tests",
          learning_objectives: "Verify normality and perform rank tests.",
          topics: ["Shapiro-Wilk normality test", "Mann-Whitney U test", "Kruskal-Wallis rank test"],
          subtopics: ["QQ Plots", "Signed rank test", "Chi-Square independence test"],
          resources: ["Nonparametric Statistical Methods"]
        },
        {
          unit_number: 4,
          title: "Regression Diagnostics in Computing",
          learning_objectives: "Check collinearity, heteroscedasticity, and outliers.",
          topics: ["Multicollinearity & VIF", "Residual analysis", "Cook's distance"],
          subtopics: ["Durbin-Watson test", "Heteroscedasticity fixes", "Influence diagnostics"],
          resources: ["Applied Linear Regression Models"]
        },
        {
          unit_number: 5,
          title: "Statistical Quality Control",
          learning_objectives: "Plot control charts for manufacturing audits.",
          topics: ["X-bar & R Charts", "P and C Control charts", "Process Capability Index (Cp)"],
          subtopics: ["Common vs assignable causes", "Upper/Lower control limits", "Six Sigma metrics"],
          resources: ["Introduction to Statistical Quality Control by Montgomery"]
        }
      ]
    },
    {
      course_code: "CS23431",
      course_name: "Operating Systems",
      credits: 3,
      category: "PC",
      description: "Process management, CPU scheduling, deadlocks, memory management, file systems, disk scheduling.",
      learning_outcomes: ["Calculate CPU scheduling times", "Resolve deadlocks using banker's rule", "Implement page replacement algorithms"],
      units: [
        {
          unit_number: 1,
          title: "Process Scheduling",
          learning_objectives: "Master processes states and CPU scheduling routines.",
          topics: ["Process control block (PCB)", "Round Robin scheduling", "Shortest Job First (SJF)"],
          subtopics: ["Context switching", "Preemptive vs Non-preemptive scheduling", "Priority scheduling"],
          resources: ["Operating System Concepts by Silberschatz"]
        },
        {
          unit_number: 2,
          title: "Process Synchronization and Deadlocks",
          learning_objectives: "Solve race conditions and prevent deadlocks.",
          topics: ["Critical Section Problem", "Semaphores", "Banker's Algorithm for Deadlocks"],
          subtopics: ["Mutex locks", "Producer-Consumer problem", "Deadlock detection & recovery"],
          resources: ["Operating Systems by Stallings"]
        },
        {
          unit_number: 3,
          title: "Memory Management",
          learning_objectives: "Analyze paging and segmentation schemes.",
          topics: ["Paging", "Segmentation", "Virtual memory concepts"],
          subtopics: ["Page tables", "Translation Lookaside Buffer (TLB)", "Fragmentation"],
          resources: ["Modern Operating Systems by Tanenbaum"]
        },
        {
          unit_number: 4,
          title: "Page Replacement and Disk Scheduling",
          learning_objectives: "Reduce page faults and optimize disk arm movements.",
          topics: ["LRU Page replacement", "Optimal page replacement", "SSTF Disk scheduling"],
          subtopics: ["FIFO page replacement", "SCAN & C-SCAN scheduling", "Thrashing"],
          resources: ["Operating Systems by Dhamdhere"]
        },
        {
          unit_number: 5,
          title: "File Systems and Protection",
          learning_objectives: "Outline directory formats and file allocation pointers.",
          topics: ["File allocation methods (Linked, Indexed)", "Directory structures", "Access control matrices"],
          subtopics: ["FAT vs NTFS", "User authentication in OS", "Kernel security structures"],
          resources: ["Operating System Principles"]
        }
      ]
    },
    {
      course_code: "CS23432",
      course_name: "Software Construction",
      credits: 3,
      category: "PC",
      description: "Agile, Git branching, unit testing, design patterns, refactoring, and code analysis.",
      learning_outcomes: ["Write clean modular code", "Perform Git operations", "Implement JUnit tests"],
      units: [
        {
          unit_number: 1,
          title: "Introduction to Software Engineering",
          learning_objectives: "Understand lifecycle models like Agile/Scrum.",
          topics: ["Waterfall model", "Agile methodologies", "Scrum sprint planning"],
          subtopics: ["Requirements specification (SRS)", "User stories", "Product backlog"],
          resources: ["Software Engineering by Pressman"]
        },
        {
          unit_number: 2,
          title: "Version Control and Git",
          learning_objectives: "Manage team codebases using branch commits and mergers.",
          topics: ["Git commits & logging", "Branching & Merging", "Resolving merge conflicts"],
          subtopics: ["Git stash", "Rebasing", "Pull requests workflow"],
          resources: ["Pro Git book"]
        },
        {
          unit_number: 3,
          title: "Unit Testing and JUnit",
          learning_objectives: "Verify logic accuracy using test suites.",
          topics: ["TDD principles", "JUnit asserts", "Mocking with Mockito"],
          subtopics: ["Boundary value testing", "Test coverage", "Integration testing"],
          resources: ["Test Driven Development by Kent Beck"]
        },
        {
          unit_number: 4,
          title: "Design Patterns",
          learning_objectives: "Implement Creational, Structural, and Behavioral patterns.",
          topics: ["Singleton pattern", "Factory Method pattern", "Observer pattern"],
          subtopics: ["MVC architecture", "Adapter pattern", "Strategy pattern"],
          resources: ["Design Patterns by Gang of Four"]
        },
        {
          unit_number: 5,
          title: "Refactoring and Code Quality",
          learning_objectives: "Identify code smells and clean technical debt.",
          topics: ["Code smells detection", "Refactoring techniques", "Static code analysis"],
          subtopics: ["DRY and SOLID principles", "Linting configurations", "Technical debt analysis"],
          resources: ["Refactoring by Martin Fowler"]
        }
      ]
    },
    {
      course_code: "GE23421",
      course_name: "Soft Skills I",
      credits: 1,
      category: "HS",
      description: "Personality development, professional dressing, body language, public speaking.",
      learning_outcomes: ["Conduct oneself professionally", "Deliver short impromptu talks"],
      units: [
        {
          unit_number: 1,
          title: "Self Analysis & Attitude",
          learning_objectives: "Assess strengths, weaknesses, and goal orientations.",
          topics: ["SWOT analysis", "Goal setting (SMART goals)", "Positive mindset"],
          subtopics: ["Self esteem building", "Proactive behaviors", "Internal vs external motivation"],
          resources: ["Seven Habits of Highly Effective People"]
        },
        {
          unit_number: 2,
          title: "Effective Presentation & Vocal Delivery",
          learning_objectives: "Express ideas with clear modulation and posture.",
          topics: ["Tone of voice", "Body language basics", "Stage fear mitigation"],
          subtopics: ["Eye contact", "Speed of articulation", "Hand gestures"],
          resources: ["Soft Skills Lab Manual"]
        },
        {
          unit_number: 3,
          title: "Etiquette and Grooming",
          learning_objectives: "Demonstrate corporate workspace manners.",
          topics: ["Corporate dressing", "Telephone etiquette", "E-mail signatures"],
          subtopics: ["Handshake protocols", "Meeting behaviors", "Dining etiquette"],
          resources: ["Corporate Etiquette Guide"]
        },
        {
          unit_number: 4,
          title: "Interpersonal Relations",
          learning_objectives: "Establish healthy group connections.",
          topics: ["Empathy and active listening", "Conflict resolution", "Assertiveness skills"],
          subtopics: ["Team building activities", "Handling criticism", "Peer collaboration"],
          resources: ["How to Win Friends and Influence People"]
        },
        {
          unit_number: 5,
          title: "Time Management",
          learning_objectives: "Prioritize projects using quadrant matrices.",
          topics: ["Eisenhower matrix", "Procrastination mitigation", "Urgent vs Important classification"],
          subtopics: ["Pomodoro technique", "Scheduling daily planners", "Work-life boundaries"],
          resources: ["First Things First"]
        }
      ]
    },
    {
      course_code: "AD23421",
      course_name: "Internship",
      credits: 1,
      category: "PC",
      description: "Industry training experience in Artificial Intelligence & Data Science projects.",
      learning_outcomes: ["Apply academic knowledge in industry", "Write corporate progress summaries"],
      units: [
        {
          unit_number: 1,
          title: "Organizational Structure Study",
          learning_objectives: "Understand hierarchy and production flows of host company.",
          topics: ["Company overview", "Department divisions", "Reporting hierarchy"],
          subtopics: ["HR policies", "Workspace tools standard", "Communication channels"],
          resources: ["Company Induction Booklet"]
        },
        {
          unit_number: 2,
          title: "Project Requirements Analysis",
          learning_objectives: "Specify client requirements for assigned tasks.",
          topics: ["Problem statement analysis", "Feasibility reviews", "Data pipelines design"],
          subtopics: ["Input source formats", "KPIs definitions", "Software constraints"],
          resources: ["Project Brief Sheets"]
        },
        {
          unit_number: 3,
          title: "Development Phase",
          learning_objectives: "Implement programs/scripts to achieve deliverables.",
          topics: ["Coding & testing scripts", "Database integrations", "API links verification"],
          subtopics: ["Git commits checks", "Debugging errors", "Modular configurations"],
          resources: ["Stackoverflow & Documentation"]
        },
        {
          unit_number: 4,
          title: "Testing and Validation",
          learning_objectives: "Validate system parameters against targets.",
          topics: ["UAT (User Acceptance Testing)", "Performance testing", "Load checks"],
          subtopics: ["Edge cases evaluation", "Refining code metrics", "Logging validation errors"],
          resources: ["Testing Framework Guidelines"]
        },
        {
          unit_number: 5,
          title: "Report Writing and Presentation",
          learning_objectives: "Compile internship achievements in a report.",
          topics: ["Final project report compilation", "Presentation slide assembly", "Viva-voce review"],
          subtopics: ["Formatting references", "Technical diagrams overview", "Executive summaries"],
          resources: ["College Internship Guidelines"]
        }
      ]
    }
  ],
  5: [
    {
      course_code: "PE23501",
      course_name: "Professional Elective I",
      credits: 3,
      category: "PE",
      description: "Advanced AI topic selected by the student in alignment with their specialization.",
      learning_outcomes: ["Explain elective algorithms", "Evaluate elective methodologies"],
      units: [
        {
          unit_number: 1,
          title: "Foundations of Specialization",
          learning_objectives: "Key theoretical principles of the elective domain.",
          topics: ["Introduction", "Domain constraints", "Core architectures"],
          subtopics: ["History", "Standard representations"],
          resources: ["Specialization Manual Vol 1"]
        },
        {
          unit_number: 2,
          title: "Algorithmic Frameworks",
          learning_objectives: "Core algorithms and mathematical proofs.",
          topics: ["Mathematical formulations", "Pseudo-code analysis", "Core solvers"],
          subtopics: ["Complexity classes", "Validation parameters"],
          resources: ["Specialization Manual Vol 2"]
        },
        {
          unit_number: 3,
          title: "System Implementations",
          learning_objectives: "Build simple layouts using specialization tools.",
          topics: ["Programming tools", "API linkages", "Debugging routines"],
          subtopics: ["Environment setups", "Package imports"],
          resources: ["GitHub Repositories"]
        },
        {
          unit_number: 4,
          title: "Performance Audits",
          learning_objectives: "Audit systems against industry benchmarks.",
          topics: ["Outlier checks", "Error tracking", "Data validation"],
          subtopics: ["Accuracy plots", "Speed logs"],
          resources: ["Analytical Audits Guide"]
        },
        {
          unit_number: 5,
          title: "Research Scope and Future Directions",
          learning_objectives: "Outline future research trends.",
          topics: ["Industry 5.0 adaptations", "Open research papers", "Limitations of models"],
          subtopics: ["Security vulnerabilities", "Hardware constraints"],
          resources: ["Specialization Review Papers"]
        }
      ]
    },
    {
      course_code: "PE23502",
      course_name: "Professional Elective II",
      credits: 3,
      category: "PE",
      description: "Specialized computer science and data science frameworks chosen by the student.",
      learning_outcomes: ["Construct elective workflows", "Apply elective modules"],
      units: [
        {
          unit_number: 1,
          title: "Core Introduction",
          learning_objectives: "Theoretical prerequisites of the secondary elective.",
          topics: ["Introductory topics", "System models", "Standards and protocols"],
          subtopics: ["Definitions", "Architecture models"],
          resources: ["Elective II Readings"]
        },
        {
          unit_number: 2,
          title: "Advanced Mechanisms",
          learning_objectives: "Analyze complex workflows in chosen course.",
          topics: ["Flow dynamics", "Structural configurations", "State controllers"],
          subtopics: ["Variables mapping", "Control flow tables"],
          resources: ["Elective II Readings Vol II"]
        },
        {
          unit_number: 3,
          title: "Practical Laboratory Setups",
          learning_objectives: "Hands-on configurations of chosen elective.",
          topics: ["Lab experiments overview", "Configuration scripts", "Compilation checks"],
          subtopics: ["Dependency resolutions", "Mock database connections"],
          resources: ["Lab Manual Electives"]
        },
        {
          unit_number: 4,
          title: "Validation Frameworks",
          learning_objectives: "Check data pipeline outputs against standard benchmarks.",
          topics: ["Performance KPIs", "Accuracy thresholds", "Verification algorithms"],
          subtopics: ["F-Score checks", "Time complexities comparisons"],
          resources: ["Quality Assurance Guide"]
        },
        {
          unit_number: 5,
          title: "Industrial Deployments",
          learning_objectives: "Apply chosen course to real industrial scenarios.",
          topics: ["Cloud integrations", "Security protocols", "Case studies analysis"],
          subtopics: ["Edge applications", "Sustainability boundaries"],
          resources: ["IEEE Transactions on Applied Systems"]
        }
      ]
    },
    {
      course_code: "AD23531",
      course_name: "Big Data Architecture",
      credits: 3,
      category: "PC",
      description: "Hadoop, MapReduce, Spark, Spark SQL, NoSQL DB, and streaming architectures.",
      learning_outcomes: ["Explain Hadoop architecture", "Write Spark transformations", "Describe Lambda streaming architecture"],
      units: [
        {
          unit_number: 1,
          title: "Hadoop and HDFS",
          learning_objectives: "Explain Hadoop architecture and block storage.",
          topics: ["Hadoop ecosystem", "HDFS block sizing & replication", "NameNode and DataNode roles"],
          subtopics: ["Secondary NameNode", "HDFS commands", "Safe mode details"],
          resources: ["Hadoop: The Definitive Guide by Tom White"]
        },
        {
          unit_number: 2,
          title: "MapReduce Framework",
          learning_objectives: "Write map and reduce operations for word count and filters.",
          topics: ["MapReduce workflow", "Map, Shuffle, Sort, Reduce phases", "Combiners and Partitioners"],
          subtopics: ["WordCount program", "MapReduce algorithms", "YARN scheduler"],
          resources: ["Data-Intensive Text Processing with MapReduce"]
        },
        {
          unit_number: 3,
          title: "Apache Spark Core",
          learning_objectives: "Apply transformations and actions on Spark RDDs.",
          topics: ["RDD concept", "Transformations vs Actions", "Lazy evaluation"],
          subtopics: ["Map, filter, reduceByKey RDD ops", "Lineage graph", "Spark execution context"],
          resources: ["Learning Spark by Holden Karau"]
        },
        {
          unit_number: 4,
          title: "Spark SQL and DataFrames",
          learning_objectives: "Write Spark SQL queries over structured data formats.",
          topics: ["SparkSession", "DataFrames creation", "Spark SQL syntax"],
          subtopics: ["JSON & Parquet loading", "UDFs (User Defined Functions)", "Catalyst optimizer"],
          resources: ["Spark: The Definitive Guide by Chambers & Zaharia"]
        },
        {
          unit_number: 5,
          title: "Big Data Streaming and Lambda Architecture",
          learning_objectives: "Describe real-time data pipelines using Kafka and Spark Streaming.",
          topics: ["Kafka topics and brokers", "Spark Structured Streaming", "Lambda vs Kappa Architecture"],
          subtopics: ["Sliding window calculations", "Watermarking", "Sink configurations"],
          resources: ["Designing Data-Intensive Applications by Martin Kleppmann"]
        }
      ]
    },
    {
      course_code: "AD23532",
      course_name: "Principles of Data Science",
      credits: 3,
      category: "PC",
      description: "Data pipelines, preprocessing, linear models, classification, and exploratory analytics.",
      learning_outcomes: ["Clean missing data values", "Perform linear regression plots", "Interpret PCA components"],
      units: [
        {
          unit_number: 1,
          title: "Data Preprocessing and Wrangling",
          learning_objectives: "Handle missing data values and scale columns.",
          topics: ["Data cleaning pipelines", "Imputation strategies", "StandardScaler and MinMaxScaler"],
          subtopics: ["One-hot encoding", "Feature scaling", "Handling outliers"],
          resources: ["Data Science from Scratch by Joel Grus"]
        },
        {
          unit_number: 2,
          title: "Exploratory Data Analysis",
          learning_objectives: "Formulate correlation matrices and pairplots.",
          topics: ["Descriptive statistics summaries", "Correlation matrix", "Pairwise plots and distribution visuals"],
          subtopics: ["Skewness and Kurtosis", "Groupby aggregates", "ANOVA checks"],
          resources: ["Practical Statistics for Data Scientists"]
        },
        {
          unit_number: 3,
          title: "Linear Models and Predictions",
          learning_objectives: "Perform regressions and analyze residual distributions.",
          topics: ["Ordinary Least Squares (OLS)", "Multiple linear regression", "Ridge and Lasso regression"],
          subtopics: ["Residual analysis", "R-squared value", "Regularization alpha tuning"],
          resources: ["Introduction to Statistical Learning"]
        },
        {
          unit_number: 4,
          title: "Classification and Grouping",
          learning_objectives: "Build decision trees and evaluate model performance.",
          topics: ["Decision tree induction", "K-Nearest Neighbors", "Logistic regression classifier"],
          subtopics: ["Gini index", "Confusion Matrix metrics", "ROC-AUC curves"],
          resources: ["Data Science for Business"]
        },
        {
          unit_number: 5,
          title: "Dimensionality and Compression",
          learning_objectives: "Perform PCA and interpret component weights.",
          topics: ["PCA (Principal Component Analysis)", "Eigenvalues & Eigenvectors", "Variance explained plot"],
          subtopics: ["SVD (Singular Value Decomposition)", "Feature selection metrics", "t-SNE visualization"],
          resources: ["Foundations of Data Science"]
        }
      ]
    },
    {
      course_code: "AI23531",
      course_name: "Deep Learning",
      credits: 3,
      category: "PC",
      description: "Multi-layer perceptrons, backpropagation, CNNs, RNNs, LSTMs, Transformers, and optimization algorithms.",
      learning_outcomes: ["Implement Backpropagation", "Construct CNN architectures", "Train RNNs & LSTMs"],
      units: [
        {
          unit_number: 1,
          title: "Neural Networks Foundations",
          learning_objectives: "Calculate activations and perform backpropagation.",
          topics: ["Perceptron learning rule", "Activation functions (ReLU, Sigmoid)", "Backpropagation algorithm"],
          subtopics: ["Loss functions (MSE, Cross-Entropy)", "Vanishing gradient problem", "Weights initialization"],
          resources: ["Deep Learning by Ian Goodfellow"]
        },
        {
          unit_number: 2,
          title: "Convolutional Neural Networks (CNNs)",
          learning_objectives: "Design convolution, pooling, and fully connected layers.",
          topics: ["Convolutional operations", "Max pooling & Padding", "AlexNet and VGG architectures"],
          subtopics: ["Receptive fields", "Feature map dimensions", "ResNet skip connections"],
          resources: ["Deep Learning with PyTorch by Eli Stevens"]
        },
        {
          unit_number: 3,
          title: "Recurrent Neural Networks (RNNs)",
          learning_objectives: "Understand RNN structures and LSTM gates.",
          topics: ["Sequence models basics", "LSTM gating mechanics", "GRU architecture"],
          subtopics: ["Hidden state updates", "Backpropagation through time (BPTT)", "Bidirectional RNNs"],
          resources: ["Hands-On Machine Learning by Aurelien Geron"]
        },
        {
          unit_number: 4,
          title: "Optimization and Regularization",
          learning_objectives: "Apply Adam optimizer, dropout, and batch normalization.",
          topics: ["Stochastic Gradient Descent (SGD)", "Adam and RMSprop optimizers", "Dropout regularization"],
          subtopics: ["Batch normalization", "Early stopping", "Data augmentation"],
          resources: ["Deep Learning Cookbook"]
        },
        {
          unit_number: 5,
          title: "Transformers and Attention",
          learning_objectives: "Explain self-attention and Transformer block layouts.",
          topics: ["Attention mechanism", "Self-Attention calculation", "Transformer encoder-decoder"],
          subtopics: ["Query, Key, Value vectors", "Multi-head attention", "Positional encoding"],
          resources: ["Attention Is All You Need (Vaswani et al.)"]
        }
      ]
    },
    {
      course_code: "CS23532",
      course_name: "Computer Networks",
      credits: 3,
      category: "PC",
      description: "ISO/OSI reference model, routing algorithms, TCP/UDP, DNS, HTTP, and socket programming.",
      learning_outcomes: ["Compare OSI and TCP/IP layers", "Apply routing algorithms (Dijkstra, Bellman-Ford)", "Write simple socket programs"],
      units: [
        {
          unit_number: 1,
          title: "Physical and Data Link Layers",
          learning_objectives: "Analyze packet framing and collision detection.",
          topics: ["OSI & TCP/IP models", "Framing & Error detection (CRC)", "CSMA/CD protocol"],
          subtopics: ["Flow control (Sliding Window)", "Ethernet standards", "Switching basics"],
          resources: ["Computer Networks by Tanenbaum"]
        },
        {
          unit_number: 2,
          title: "Network Layer",
          learning_objectives: "Compute shortest routes using Dijkstra and distance vector.",
          topics: ["IPv4 and IPv6 addressing", "Dijkstra's Link State routing", "Distance Vector routing (Bellman-Ford)"],
          subtopics: ["Subnetting", "ICMP diagnostics", "Routing Information Protocol (RIP)"],
          resources: ["Computer Networking: A Top-Down Approach by Kurose & Ross"]
        },
        {
          unit_number: 3,
          title: "Transport Layer Protocols",
          learning_objectives: "Detail TCP connection setup and congestion control.",
          topics: ["TCP 3-way handshake", "UDP stateless transfer", "TCP congestion control window"],
          subtopics: ["Flow control sliding window", "Window scaling", "Congestion avoidance algorithms"],
          resources: ["TCP/IP Illustrated by Stevens"]
        },
        {
          unit_number: 4,
          title: "Application Layer Services",
          learning_objectives: "Describe DNS, HTTP, and SMTP protocols.",
          topics: ["Domain Name System (DNS)", "HTTP request/response structure", "SMTP & POP3 email transfer"],
          subtopics: ["DHCP dynamic configuration", "FTP protocol", "HTTPS SSL/TLS basics"],
          resources: ["Computer Networks and Internets by Comer"]
        },
        {
          unit_number: 5,
          title: "Socket Programming",
          learning_objectives: "Write simple client-server network applications in Python/C.",
          topics: ["TCP socket methods", "UDP socket methods", "Multi-client server handling"],
          subtopics: ["bind, listen, accept calls", "Port mapping", "Network buffer reading"],
          resources: ["Unix Network Programming by Stevens"]
        }
      ]
    },
    {
      course_code: "GE23521",
      course_name: "Soft Skills II",
      credits: 1,
      category: "HS",
      description: "Mock interviews, resume writing, corporate communications, and stress management.",
      learning_outcomes: ["Design a professional resume", "Excel in standard interview loops", "Practice stress reduction methods"],
      units: [
        {
          unit_number: 1,
          title: "Resume & CV Construction",
          learning_objectives: "Draft a modern functional ATS-friendly resume.",
          topics: ["ATS checks", "Action verbs usage", "Cover letters formatting"],
          subtopics: ["Formatting sections", "Quantifying achievements", "LinkedIn profile setups"],
          resources: ["Resume Writing Guide"]
        },
        {
          unit_number: 2,
          title: "Interview Strategies",
          learning_objectives: "Answer STAR-format behavioral questions.",
          topics: ["STAR technique", "Behavioral interview prep", "Technical viva loops"],
          subtopics: ["Handling difficult questions", "Body posture during interviews", "Post-interview follow-ups"],
          resources: ["Cracking the Coding Interview"]
        },
        {
          unit_number: 3,
          title: "Corporate Communication & Team meetings",
          learning_objectives: "Formulate meeting minutes and email proposals.",
          topics: ["Writing MoM (Minutes of Meeting)", "Emailing supervisors", "Slack workspace rules"],
          subtopics: ["Cross-cultural communications", "Constructive feedback delivery", "Virtual meeting setups"],
          resources: ["Corporate Communications Handbook"]
        },
        {
          unit_number: 4,
          title: "Stress and Conflict Management",
          learning_objectives: "Resolve coworker friction and maintain stress limits.",
          topics: ["Win-Win negotiation", "De-escalation patterns", "Mindfulness and breathing"],
          subtopics: ["Identifying burnout", "Time tracking boundaries", "Active empathy"],
          resources: ["Crucial Conversations"]
        },
        {
          unit_number: 5,
          title: "Leadership & Critical Thinking",
          learning_objectives: "Solve problems dynamically in group environments.",
          topics: ["Root cause analysis", "Five Whys technique", "Delegating tasks"],
          subtopics: ["Decision trees in planning", "Team motivation models", "Ethical leadership"],
          resources: ["Think Fast and Slow"]
        }
      ]
    }
  ],
  6: [
    {
      course_code: "PE23603",
      course_name: "Professional Elective III",
      credits: 3,
      category: "PE",
      description: "Advanced algorithms in NLP, Computer Vision, or Big Data analytics.",
      learning_outcomes: ["Build elective models", "Deploy elective pipelines"],
      units: [
        {
          unit_number: 1,
          title: "Domain Introduction",
          learning_objectives: "Advanced principles and baseline metrics.",
          topics: ["Core concepts", "Performance benchmarks", "Standard pipelines"],
          subtopics: ["Definitions", "Architecture blocks"],
          resources: ["Elective III Notes"]
        },
        {
          unit_number: 2,
          title: "Detailed Modeling",
          learning_objectives: "Develop mathematical model parameters.",
          topics: ["Model loss computation", "Hyperparameter tuning", "Optimization routines"],
          subtopics: ["Regularization", "Epoch configs"],
          resources: ["Elective III Modeling Guide"]
        },
        {
          unit_number: 3,
          title: "Framework Integrations",
          learning_objectives: "Build workflows in PyTorch/TensorFlow.",
          topics: ["Framework packages", "Custom layers", "Training scripts"],
          subtopics: ["Data loaders", "GPU configurations"],
          resources: ["GitHub Repositories"]
        },
        {
          unit_number: 4,
          title: "Model Validation",
          learning_objectives: "Evaluate accuracy, precision, and F1 results.",
          topics: ["ROC curves", "Precision-Recall curves", "Confusion matrices"],
          subtopics: ["Cross-validation checks", "Error analysis tables"],
          resources: ["Model Diagnostics Manual"]
        },
        {
          unit_number: 5,
          title: "Advanced Case Studies",
          learning_objectives: "Examine real-world industrial deployments.",
          topics: ["Industrial deployments", "Cloud APIs", "Case studies"],
          subtopics: ["Scalability bounds", "Privacy and bias checks"],
          resources: ["IEEE Intelligent Systems"]
        }
      ]
    },
    {
      course_code: "OE23602",
      course_name: "Open Elective II",
      credits: 3,
      category: "OE",
      description: "Allied discipline elective course chosen by the student.",
      learning_outcomes: ["Explain cross-disciplinary systems", "Evaluate elective solutions"],
      units: [
        {
          unit_number: 1,
          title: "Elective II Basics",
          learning_objectives: "Core structures and terminology of chosen field.",
          topics: ["Overview", "Basic terms", "System requirements"],
          subtopics: ["Scope", "Design boundaries"],
          resources: ["Elective II Courseware"]
        },
        {
          unit_number: 2,
          title: "Operational Mechanics",
          learning_objectives: "Review operational workflow of Chosen Elective II.",
          topics: ["Processes", "Structural loops", "Hardware/Software interactions"],
          subtopics: ["Inputs mapping", "Error controls"],
          resources: ["Elective II Courseware Vol II"]
        },
        {
          unit_number: 3,
          title: "System Integrations",
          learning_objectives: "Link chosen elective concepts with AI applications.",
          topics: ["Case studies", "APIs connection", "Data normalization"],
          subtopics: ["Cross validations", "Pipeline layouts"],
          resources: ["Applied Electives Review"]
        },
        {
          unit_number: 4,
          title: "Audits and Optimization",
          learning_objectives: "Optimize parameters using standard algorithms.",
          topics: ["Evaluation methods", "Optimization loops", "Audit reports"],
          subtopics: ["Efficiency statistics", "Loss minimization"],
          resources: ["Optimization Manual"]
        },
        {
          unit_number: 5,
          title: "Advanced Implementations",
          learning_objectives: "Verify output stability under stress test scenarios.",
          topics: ["Stress tests", "Industrial standards", "Future expansions"],
          subtopics: ["Environmental safety", "Ethics in engineering"],
          resources: ["Industrial Systems Journal"]
        }
      ]
    },
    {
      course_code: "AD23631",
      course_name: "Data Privacy and Security",
      credits: 3,
      category: "PC",
      description: "Symmetric and asymmetric cryptography, access controls, database security, GDPR, and differential privacy.",
      learning_outcomes: ["Apply AES and RSA algorithms", "Configure database access roles", "Implement Laplace differential privacy"],
      units: [
        {
          unit_number: 1,
          title: "Cryptography Foundations",
          learning_objectives: "Understand symmetric and asymmetric cryptosystems.",
          topics: ["Symmetric cryptography (AES)", "Asymmetric cryptography (RSA)", "Cryptographic Hash (SHA-256)"],
          subtopics: ["Diffie-Hellman Key Exchange", "Public & Private keys", "Digital signatures"],
          resources: ["Cryptography and Network Security by William Stallings"]
        },
        {
          unit_number: 2,
          title: "Access Control and Database Security",
          learning_objectives: "Implement RBAC models and SQL injection prevention.",
          topics: ["RBAC (Role Based Access Control)", "SQL Injection prevention", "Database audit trails"],
          subtopics: ["DAC vs MAC models", "Prepared statements", "Row-level encryption"],
          resources: ["Database Security by Castano"]
        },
        {
          unit_number: 3,
          title: "Privacy-Preserving Data Mining",
          learning_objectives: "Apply k-anonymity, l-diversity, and t-closeness.",
          topics: ["k-Anonymity model", "l-Diversity extension", "t-Closeness details"],
          subtopics: ["Quasi-identifiers", "Data generalization & suppression", "Re-identification attacks"],
          resources: ["Privacy-Preserving Data Mining: Models and Algorithms"]
        },
        {
          unit_number: 4,
          title: "Differential Privacy",
          learning_objectives: "Add Laplace and Gaussian noise to aggregate outputs.",
          topics: ["Differential privacy definition", "Laplace Mechanism", "Gaussian Mechanism"],
          subtopics: ["Privacy budget epsilon", "Global sensitivity", "Composition theorems"],
          resources: ["The Algorithmic Foundations of Differential Privacy by Cynthia Dwork"]
        },
        {
          unit_number: 5,
          title: "Regulations and Ethics",
          learning_objectives: "Review GDPR compliance and HIPAA guidelines.",
          topics: ["GDPR principles", "HIPAA regulations", "Data protection impact assessments (DPIA)"],
          subtopics: ["Right to be forgotten", "Data portability", "AI bias ethics"],
          resources: ["EU GDPR Guidelines Official Portal"]
        }
      ]
    },
    {
      course_code: "AD23632",
      course_name: "Framework for Data and Visual Analytics",
      credits: 3,
      category: "PC",
      description: "Tableau, PowerBI, D3.js, interactive dashboards, storyboards, and data visualization paradigms.",
      learning_outcomes: ["Build Tableau dashboards", "Write custom D3.js plots", "Design cohesive storyboards"],
      units: [
        {
          unit_number: 1,
          title: "Visualization Principles",
          learning_objectives: "Understand visual encodings, color theory, and Gestalt principles.",
          topics: ["Visual variables (size, color, value)", "Gestalt principles of grouping", "Color palettes selection"],
          subtopics: ["Lie factor in charts", "Data-to-ink ratio", "Chart types guidelines"],
          resources: ["Show Me the Numbers by Stephen Few"]
        },
        {
          unit_number: 2,
          title: "Tableau and PowerBI",
          learning_objectives: "Create calculated fields and interactive filters.",
          topics: ["Data connections in Tableau", "Calculated fields & LOD expressions", "Interactive dashboard sheets"],
          subtopics: ["Parameters", "Storyboard assembly", "DAX expressions in PowerBI"],
          resources: ["Tableau Your Data! by Dan Murray"]
        },
        {
          unit_number: 3,
          title: "D3.js for Interactive Charts",
          learning_objectives: "Bind data to SVG elements and render axes.",
          topics: ["D3 selections & data binding", "SVG drawing basics", "Scale functions and axes"],
          subtopics: ["Enter, Update, Exit pattern", "Transition animations", "Interactive tooltips"],
          resources: ["Interactive Data Visualization for the Web by Scott Murray"]
        },
        {
          unit_number: 4,
          title: "Geospatial Visualizations",
          learning_objectives: "Map spatial data using choropleths.",
          topics: ["GeoJSON & TopoJSON structures", "Choropleth maps", "Projections (Mercator, Albers)"],
          subtopics: ["Spatial indexing", "Layering geographical points", "Leaflet.js basics"],
          resources: ["Cartography and Visualization Guide"]
        },
        {
          unit_number: 5,
          title: "High-Dimensional Data Visuals",
          learning_objectives: "Analyze correlations using heatmaps and parallel coordinate plots.",
          topics: ["Heatmaps matrix", "Parallel Coordinates Plot", "Treemaps and Sunburst diagrams"],
          subtopics: ["Scatterplot matrices", "Dimensionality reduction projections", "Visualizing networks"],
          resources: ["Visualizing Data by Ben Fry"]
        }
      ]
    },
    {
      course_code: "CS23634",
      course_name: "Fundamentals of Generative AI and Prompt Engineering",
      credits: 3,
      category: "PC",
      description: "LLMs, prompt engineering (CoT, ReAct), fine-tuning, embeddings, GANs, and diffusion models.",
      learning_outcomes: ["Apply advanced prompt templates", "Explain GAN loss structures", "Outline RAG vector lookup"],
      units: [
        {
          unit_number: 1,
          title: "Introduction to Generative Models",
          learning_objectives: "Differentiate autoregressive models and autoencoders.",
          topics: ["Generative vs Discriminative", "Autoregressive language models", "Variational Autoencoders (VAEs)"],
          subtopics: ["Latent spaces", "Decoder networks", "Tokenization models"],
          resources: ["Generative Deep Learning by David Foster"]
        },
        {
          unit_number: 2,
          title: "GANs and Diffusion Models",
          learning_objectives: "Explain generator-discriminator games and reverse diffusion.",
          topics: ["Generative Adversarial Networks (GANs)", "Denoising Diffusion Probabilistic Models (DDPM)", "Stable Diffusion"],
          subtopics: ["Minimax loss", "Forward vs reverse process", "Classifier-free guidance"],
          resources: ["GANs in Action"]
        },
        {
          unit_number: 3,
          title: "Prompt Engineering Techniques",
          learning_objectives: "Write multi-step prompt chains.",
          topics: ["Few-Shot prompting", "Chain of Thought (CoT)", "ReAct (Reasoning and Acting)"],
          subtopics: ["Zero-shot roleplay", "Prompt templates guidelines", "System prompts structuring"],
          resources: ["Learn Prompting Online Course Docs"]
        },
        {
          unit_number: 4,
          title: "LLM Orchestration and Embeddings",
          learning_objectives: "Utilize langchain and vector indices.",
          topics: ["Text embeddings models", "Vector databases index (HNSW)", "LLM chains"],
          subtopics: ["Cosine similarity", "LangChain structure", "Memory buffers"],
          resources: ["LangChain Documentation"]
        },
        {
          unit_number: 5,
          title: "Fine-Tuning and RLHF",
          learning_objectives: "Apply LoRA and explain reward modeling.",
          topics: ["LoRA (Low Rank Adaptation)", "RLHF (Reinforcement Learning from Human Feedback)", "Quantization (QLoRA)"],
          subtopics: ["Reward model training", "PPO optimization", "Instruction tuning datasets"],
          resources: ["Hugging Face Transformers Guide"]
        }
      ]
    },
    {
      course_code: "GE23627",
      course_name: "Design Thinking and Innovation",
      credits: 2,
      category: "ES",
      description: "Empathy mapping, brainstorming, prototyping, testing, and business model generation.",
      learning_outcomes: ["Construct empathy maps", "Develop low-fidelity prototypes", "Present pitch desk models"],
      units: [
        {
          unit_number: 1,
          title: "Empathize Phase",
          learning_objectives: "Conduct user interviews and map customer journeys.",
          topics: ["User persona definition", "Empathy mapping template", "Customer journey mapping"],
          subtopics: ["Interview techniques", "Observational research", "Pain points extraction"],
          resources: ["Change by Design by Tim Brown"]
        },
        {
          unit_number: 2,
          title: "Define and Ideate Phases",
          learning_objectives: "Synthesize problem statements and brainstorm options.",
          topics: ["Point of View (POV) statement", "Brainstorming rules", "SCAMPER technique"],
          subtopics: ["Mind mapping", "How Might We (HMW) questions", "Affinity diagrams"],
          resources: ["Creative Confidence by Tom & David Kelley"]
        },
        {
          unit_number: 3,
          title: "Prototype Phase",
          learning_objectives: "Build paper and wireframe prototypes.",
          topics: ["Low fidelity prototyping", "Storyboarding concepts", "Paper UI models"],
          subtopics: ["Roleplaying interactions", "3D clay mockups", "Digital wireframes basics"],
          resources: ["Design Thinking Handbook"]
        },
        {
          unit_number: 4,
          title: "Test Phase",
          learning_objectives: "Conduct usability tests and iterate design loops.",
          topics: ["User feedback loops", "Testing protocols", "Iterative refinements"],
          subtopics: ["Think-aloud testing", "Feedback capture matrix", "Pivot vs persevere"],
          resources: ["Sprint by Jake Knapp"]
        },
        {
          unit_number: 5,
          title: "Business Model Generation",
          learning_objectives: "Complete a full business model canvas.",
          topics: ["Business Model Canvas (BMC)", "Value proposition canvas", "Pitching to stakeholders"],
          subtopics: ["Revenue streams estimation", "Key partnerships", "Cost structures"],
          resources: ["Business Model Generation by Osterwalder"]
        }
      ]
    },
    {
      course_code: "GE23621",
      course_name: "Problem Solving Techniques",
      credits: 1,
      category: "ES",
      description: "Quantitative aptitude, puzzle solving, logical reasoning, and speed math.",
      learning_outcomes: ["Solve speed math equations", "Deduce logic puzzle layouts", "Verify quantitative data assumptions"],
      units: [
        {
          unit_number: 1,
          title: "Quantitative Aptitude Basics",
          learning_objectives: "Solve ratio, percentage, and averages questions.",
          topics: ["Ratio and proportions", "Percentage computations", "Averages & Mixtures"],
          subtopics: ["Partnership allocations", "Alligations method", "Weighted averages"],
          resources: ["Quantitative Aptitude by R.S. Aggarwal"]
        },
        {
          unit_number: 2,
          title: "Time, Speed, Distance & Work",
          learning_objectives: "Compute speeds and workforce efficiencies.",
          topics: ["Time and Work formulas", "Pipes and Cisterns efficiency", "Speed, Distance, Time relations"],
          subtopics: ["Relative speed", "Boats and streams", "Trains crossings calculations"],
          resources: ["Fast Track Objective Arithmetic"]
        },
        {
          unit_number: 3,
          title: "Logical Reasoning",
          learning_objectives: "Deduce blood relations and seating structures.",
          topics: ["Blood relations diagrams", "Seating arrangements (Circular & Linear)", "Coding-Decoding patterns"],
          subtopics: ["Direction sense", "Syllogisms", "Venn diagrams reasoning"],
          resources: ["A Modern Approach to Verbal & Non-Verbal Reasoning"]
        },
        {
          unit_number: 4,
          title: "Data Interpretation",
          learning_objectives: "Read tables, pie charts, and bar diagrams.",
          topics: ["Table chart reading", "Pie chart breakdown", "Bar and Line graph interpretation"],
          subtopics: ["Ratios in graphs", "Percentage growth rates in charts", "Caselets analysis"],
          resources: ["How to Prepare for Data Interpretation for CAT by Arun Sharma"]
        },
        {
          unit_number: 5,
          title: "Analytical Puzzles",
          learning_objectives: "Deduce grid and logic layouts under constraints.",
          topics: ["Grid puzzles", "Scheduling puzzles", "Logical deductions (Truth & Liars)"],
          subtopics: ["Sudoku solving math", "Binary logic", "Constraint matching"],
          resources: ["Puzzles to Puzzle You by Shakuntala Devi"]
        }
      ]
    }
  ],
  7: [
    {
      course_code: "AI23701",
      course_name: "Manufacturing AI",
      credits: 3,
      category: "PC",
      description: "Applies Artificial Intelligence to smart manufacturing systems, sensor telemetry, and predictive maintenance.",
      learning_outcomes: ["Outline Industry 4.0 CPPS architecture", "Develop predictive maintenance models", "Design digital twins for process optimization"],
      units: [
        {
          unit_number: 1,
          title: "Introduction to Smart Manufacturing",
          learning_objectives: "Understand Industry 4.0 and Cyber-Physical Production Systems.",
          topics: ["Industry 4.0", "Smart manufacturing", "Manufacturing systems", "Digital transformation", "Cyber-physical production systems", "IoT in manufacturing", "Data-driven manufacturing"],
          subtopics: ["Sensor nodes", "Automation pyramid", "Industrial communication protocols (Modbus, OPC UA)"],
          resources: ["Smart Manufacturing: Concepts and Methods"]
        },
        {
          unit_number: 2,
          title: "Manufacturing Data and Analytics",
          learning_objectives: "Process production sensor readings and compute key KPIs.",
          topics: ["Manufacturing data sources", "Production data", "Sensor data", "Data preprocessing", "Feature engineering", "Exploratory data analysis", "Production KPIs", "Data visualization"],
          subtopics: ["Overall Equipment Effectiveness (OEE)", "Time-series imputation", "Anomaly filters"],
          resources: ["Industrial Data Analytics"]
        },
        {
          unit_number: 3,
          title: "AI and Machine Learning for Manufacturing",
          learning_objectives: "Develop regression and classification models for fault detection.",
          topics: ["Predictive maintenance", "Quality prediction", "Fault detection", "Anomaly detection", "Regression models", "Classification models", "Clustering", "Model evaluation"],
          subtopics: ["Remaining Useful Life (RUL) estimation", "Isolation Forests", "One-Class SVM"],
          resources: ["Machine Learning for Cyber-Physical Systems"]
        },
        {
          unit_number: 4,
          title: "Intelligent Production Optimization",
          learning_objectives: "Solve job scheduling tasks and build decision support systems.",
          topics: ["Production optimization", "Scheduling", "Resource allocation", "Demand forecasting", "Process optimization", "Digital twins", "AI-based decision support"],
          subtopics: ["Genetic algorithm scheduling", "Mixed-integer programming", "Physics-informed neural networks"],
          resources: ["Optimization in Manufacturing"]
        },
        {
          unit_number: 5,
          title: "Advanced Manufacturing AI",
          learning_objectives: "Describe computer vision inspections and industrial safety trends.",
          topics: ["Computer vision in manufacturing", "Robotics", "Generative AI for manufacturing", "Edge AI", "Industrial AI", "AI safety", "Case studies", "Future trends"],
          subtopics: ["Defect visual detection", "Reinforcement learning in robotics", "TinyML on edge controllers"],
          resources: ["Industrial AI Frontiers"]
        }
      ]
    },
    {
      course_code: "AI23702",
      course_name: "Agentic AI",
      credits: 4,
      category: "PC",
      description: "Architectures, design patterns, LangChain, LangGraph, agentic RAG, and responsible multi-agent systems.",
      learning_outcomes: ["Build LLM-based ReAct agent templates", "Implement single-agent and multi-agent systems", "Evaluate agent reasoning accuracy"],
      units: [
        {
          unit_number: 1,
          title: "Introduction to Agentic AI",
          learning_objectives: "Differentiate static prompting from autonomous agent loops.",
          topics: ["Traditional AI", "Generative AI", "AI agents", "Agentic AI", "LLM capabilities", "Prompt engineering", "Autonomous agents", "Responsible AI"],
          subtopics: ["Action loops", "Environment states", "Tool capabilities"],
          resources: ["LLM Agents Survey Papers"]
        },
        {
          unit_number: 2,
          title: "Agent Architecture and Design Patterns",
          learning_objectives: "Analyze cognitive, memory, and tool execution pipelines.",
          topics: ["Perception", "Cognitive module", "Action module", "Learning", "Memory", "Collaboration", "Security", "Reflection", "Tool use", "Planning", "ReAct", "Multi-agent systems", "Human-in-the-loop"],
          subtopics: ["Semantic memory", "Short-term buffer", "Self-critique loops"],
          resources: ["Patterns of Agentic Design"]
        },
        {
          unit_number: 3,
          title: "Single-Agent Orchestration",
          learning_objectives: "Code stateful chains using LangChain and LangGraph.",
          topics: ["LangChain", "LangGraph", "Chains", "Tools", "Agents", "State", "Memory", "Text splitting", "Embeddings", "Vector databases"],
          subtopics: ["StateGraph nodes", "Conditional edges", "Pinecone/Chroma integrations"],
          resources: ["LangChain and LangGraph official documentation"]
        },
        {
          unit_number: 4,
          title: "Agentic RAG and Multi-Agent Systems",
          learning_objectives: "Implement retriever tools and multi-agent workflows.",
          topics: ["Retrieval Augmented Generation", "Agentic RAG", "Document retrieval", "Vector search", "Tool calling", "Multi-agent collaboration", "Agent communication", "Workflow orchestration", "Evaluation"],
          subtopics: ["Supervisor-worker pattern", "CrewAI orchestration", "Agent-to-agent prompt sharing"],
          resources: ["Multi-Agent Orchestration with CrewAI"]
        },
        {
          unit_number: 5,
          title: "Building Responsible Agentic AI Systems",
          learning_objectives: "Configure security guardrails and evaluate output consistency.",
          topics: ["Agent evaluation", "Accuracy", "Reasoning quality", "Response consistency", "Security", "Guardrails", "Human oversight", "Ethical AI", "Real-world applications", "Agentic AI case studies"],
          subtopics: ["NeMo Guardrails", "Prompt injection attacks prevention", "Agent audit logging"],
          resources: ["Ethics and Safety in Agentic Systems"]
        }
      ]
    },
    {
      course_code: "AI23703",
      course_name: "Cloud Computing",
      credits: 3,
      category: "PC",
      description: "Virtualization, IaaS/PaaS/SaaS models, cloud storage, microservices, and DevOps CI/CD pipelines.",
      learning_outcomes: ["Explain cloud delivery models", "Deploy workloads on VM containers", "Configure auto-scaling networks"],
      units: [
        {
          unit_number: 1,
          title: "Introduction to Cloud Computing",
          learning_objectives: "Distinguish between IaaS, PaaS, SaaS, and deployment variants.",
          topics: ["Cloud computing concepts", "Characteristics", "Benefits", "Roles and boundaries", "Cloud delivery models", "IaaS", "PaaS", "SaaS", "Public cloud", "Private cloud", "Hybrid cloud"],
          subtopics: ["On-demand self-service", "Broad network access", "Resource pooling"],
          resources: ["Cloud Computing: Concepts, Technology & Architecture by Erl"]
        },
        {
          unit_number: 2,
          title: "Virtual Machines and Workloads",
          learning_objectives: "Set up hypervisors and configure container nodes.",
          topics: ["Virtualization", "Hypervisors", "Virtual machines", "Containers", "Workloads", "Resource allocation", "Storage virtualization", "Network virtualization"],
          subtopics: ["Type 1 vs Type 2 Hypervisor", "Docker containerization", "Kubernetes pod basics"],
          resources: ["Virtualization Fundamentals"]
        },
        {
          unit_number: 3,
          title: "Cloud Infrastructure",
          learning_objectives: "Explain Virtual Private Networks and auto-scaling rules.",
          topics: ["Compute", "Storage", "Networking", "Virtual private networks", "Load balancing", "Auto scaling", "Availability", "Fault tolerance", "Cloud data centers"],
          subtopics: ["VPC subnets", "Application Load Balancer", "Horizontal vs Vertical scaling"],
          resources: ["AWS Cloud Practitioner Guide"]
        },
        {
          unit_number: 4,
          title: "Cloud Services and Architecture",
          learning_objectives: "Design cloud-native serverless systems.",
          topics: ["Cloud storage", "Databases", "Serverless computing", "Microservices", "Cloud-native applications", "APIs", "Cloud security", "Identity and access management", "Monitoring"],
          subtopics: ["AWS S3 / Azure Blobs", "AWS Lambda", "IAM user privileges"],
          resources: ["Cloud Native Architectures"]
        },
        {
          unit_number: 5,
          title: "Cloud Deployment and Management",
          learning_objectives: "Construct CI/CD deployment pipelines.",
          topics: ["Cloud deployment", "DevOps", "CI/CD", "Monitoring", "Cost optimization", "Security", "Backup and disaster recovery", "Scalability", "Cloud architecture case studies"],
          subtopics: ["Jenkins/GitHub Actions pipeline", "Prometheus metrics", "Disaster recovery RTO/RPO limits"],
          resources: ["DevOps Handbook"]
        }
      ]
    }
  ]
}
