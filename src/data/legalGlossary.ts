export interface GlossaryEntry {
  term: string;
  category: string;
  shortDescription: string;
  exampleText: string;
  query: string;
}

export const LEGAL_GLOSSARY: GlossaryEntry[] = [
  {
    term: 'Indemnification & Hold Harmless',
    category: 'Liability & Risk Allocation',
    shortDescription: 'One party agrees to compensate the other for specified damages, legal costs, or losses caused by third-party claims.',
    exampleText: 'Each party ("Indemnifying Party") shall defend, indemnify, and hold harmless the other party against any third-party claims arising out of breach of this Agreement.',
    query: 'Explain the Indemnification clause, why it matters, who bears the risk, and how to negotiate a cap on indemnification.',
  },
  {
    term: 'Limitation of Liability (Consequential Damages Waiver)',
    category: 'Liability & Risk Allocation',
    shortDescription: 'Caps the maximum financial payout and excludes indirect, punitive, or lost-profit damages.',
    exampleText: 'In no event shall either party be liable for indirect, incidental, or consequential damages. Total cumulative liability shall not exceed fees paid in the preceding 12 months.',
    query: 'Explain the Limitation of Liability clause, what consequential damages mean, and standard commercial liability caps.',
  },
  {
    term: 'Force Majeure',
    category: 'Excused Non-Performance',
    shortDescription: 'Excuses a party from contractual duties when unforeseeable external disasters (war, natural catastrophe, pandemics) make performance impossible.',
    exampleText: 'Neither party shall be liable for delayed performance resulting from acts of God, labor strikes, government orders, or catastrophic cyber-infrastructure failure.',
    query: 'What is a Force Majeure clause, what triggers it, and should pandemics or supply chain failures be explicitly included?',
  },
  {
    term: 'Liquidated Damages',
    category: 'Remedies & Breach',
    shortDescription: 'A pre-agreed fixed monetary amount owed if a party breaches, used when actual losses are difficult to quantify.',
    exampleText: 'In the event of unexcused delay beyond the Milestone Deadline, Contractor shall pay $500 per calendar day as liquidated damages, and not as a penalty.',
    query: 'Explain Liquidated Damages vs an unenforceable penalty clause and when courts uphold them.',
  },
  {
    term: 'Severability (Savings Clause)',
    category: 'Boilerplate & Enforceability',
    shortDescription: 'Ensures that if one clause is ruled illegal or void by a court, the remainder of the contract stays in full legal effect.',
    exampleText: 'If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be severed and the remaining provisions shall continue in full force.',
    query: 'What does a Severability clause do and why is it included in virtually every commercial contract?',
  },
  {
    term: 'Non-Compete vs Non-Solicitation',
    category: 'Restrictive Covenants',
    shortDescription: 'Non-compete bars working in the same industry; non-solicitation bars recruiting former colleagues or poaching clients.',
    exampleText: 'During the term and for 12 months thereafter, Employee shall not solicit any customer or induce any employee to leave the Company.',
    query: 'Difference between non-compete and non-solicitation, and explain why non-competes are void in California and strictly scrutinized federally.',
  },
  {
    term: 'Entire Agreement (Merger / Integration Clause)',
    category: 'Boilerplate & Interpretation',
    shortDescription: 'Declares this written document is the final complete understanding and cancels all previous oral or email promises.',
    exampleText: 'This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or understandings.',
    query: 'Explain the Merger or Entire Agreement clause and why verbal promises not written in the contract become completely unenforceable.',
  },
  {
    term: 'Work Made For Hire & IP Assignment',
    category: 'Intellectual Property',
    shortDescription: 'Guarantees the paying client owns copyright and patents in created deliverables from the moment of creation.',
    exampleText: 'All deliverables created by Contractor shall be deemed "works made for hire". Contractor hereby irrevocably assigns all worldwide copyright and patent rights.',
    query: 'Explain Work Made For Hire and why an explicit assignment clause is necessary for software and creative freelance work.',
  },
  {
    term: 'Governing Law vs Venue / Forum Selection',
    category: 'Dispute Resolution',
    shortDescription: 'Governing law determines which state rules interpret the contract; venue designates the physical courthouse or city where lawsuits must be filed.',
    exampleText: 'This Agreement shall be governed by Delaware law, and any dispute shall be heard exclusively in the state or federal courts in New Castle County, Delaware.',
    query: 'Explain the difference between governing law and choice of forum / venue, and what happens if they are left blank.',
  },
  {
    term: 'Representations and Warranties',
    category: 'Covenants & Statements of Fact',
    shortDescription: 'Formal statements of present facts (Reps) and ongoing promises of quality or condition (Warranties) upon which the other party relies.',
    exampleText: 'Provider represents and warrants that the Software does not infringe third-party intellectual property and complies with applicable data privacy statutes.',
    query: 'Explain Representations vs Warranties in contracts, what "as-is" disclaimers do, and remedies for breach of warranty.',
  },
];
