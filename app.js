/* ============================================================
   SCHOLARZ — Application Logic
   Fetches academic data from OpenAlex (free, open API)
   ============================================================ */

// ---- Constants ----
const OPENALEX_API = 'https://api.openalex.org';
const POLITE_EMAIL = 'scholarz-app@example.com'; // polite pool

// ---- DOM ----
const searchView = document.getElementById('search-view');
const dashboardView = document.getElementById('dashboard-view');
const searchName = document.getElementById('search-name');
const searchCollege = document.getElementById('search-college');
const btnSearch = document.getElementById('btn-search');
const searchResults = document.getElementById('search-results');
const btnBack = document.getElementById('btn-back');
const btnExport = document.getElementById('btn-export');

// ---- State ----
let currentProfile = null; // transformed profile data

// ---- Manual profile fallbacks ----
// Add low-online-presence professors here. The search will show these
// profiles before OpenAlex results when the name/institution matches.
const HARDCODED_PROFILES = [
  {
    id: 'manual:aparna-atul-junnarkar',
    matchNames: [
      'Aparna Atul Junnarkar',
      'Dr Aparna Atul Junnarkar',
      'Dr. Aparna Atul Junnarkar',
      'Prof Dr Aparna Atul Junnarkar',
      'Aparna Junnarkar'
    ],
    matchInstitutions: [
      'PVGCOET',
      'PVG College of Engineering and Technology',
      "PVG's College of Engineering and Technology",
      "Pune Vidyarthi Griha's College of Engineering and Technology",
      'MIT WPU',
      'MIT-WPU',
      'MIT World Peace University'
    ],
    profile: {
      name: 'Dr. Aparna Atul Junnarkar',
      id: 'manual:aparna-atul-junnarkar',
      designation: 'Associate Professor',
      institution: 'MIT WPU, Pune',
      country: 'IN',
      instType: 'education',
      contact: {
        email: 'aaj_comp@pvgcoet.ac.in',
        phone: '020 24228258'
      },
      education: [
        'Ph.D. in Computer Science and Engineering, Kalinga University, Raipur, 2018',
        'M.E. in Computer Engineering, Pune University, Pune, 2009',
        'B.E. in Computer Science and Engineering, Shivaji University, Sangli, 1999'
      ],
      researchAreas: [
        'Computer Network',
        'Computer Security',
        'IoT',
        'MANET Routing',
        'Wireless Sensor Networks',
        'Vehicular Wireless Communications',
        'Network Security'
      ],
      publications: {
        total: 24,
        citations: 142,
        h_index: 6,
        i10_index: 4,
        top_papers: [
          {
            title: 'Network Coverage Optimization using D2D Mobile Relay Technique',
            year: null,
            citations: 0,
            venue: 'International Journal of Recent Technology and Engineering (IJRTE)',
            summary: 'Work on optimizing network coverage using device-to-device mobile relay techniques for wireless communication scenarios.'
          },
          {
            title: 'Energy Optimization Algorithm for Future Wireless Communications',
            year: null,
            citations: 0,
            venue: 'Journal of Advance Research and Dynamical Control System (JARDCS)',
            summary: 'Research focused on energy optimization methods for future wireless communication networks.'
          },
          {
            title: 'Optimized Resource Utilization Algorithm for Fi-Wi Communication Networks',
            year: null,
            citations: 0,
            venue: 'Journal of Advance Research and Dynamical Control System (JARDCS)',
            summary: 'Research on improving resource utilization in fiber-wireless communication networks.'
          },
          {
            title: 'Agent based Clustering Routing Protocol for Wireless Sensor Networks',
            year: null,
            citations: 0,
            venue: 'International Journal of Recent Technology and Engineering (IJRTE)',
            summary: 'A routing protocol study for wireless sensor networks using agent-based clustering methods.'
          },
          {
            title: 'Robust and Reliable Multicast Routing Protocol for IoT Enabled Vehicular Wireless Communications',
            year: null,
            citations: 0,
            venue: 'Periodicals of Engineering and Natural Sciences (PEN)',
            summary: 'Research on reliable multicast routing for IoT-enabled vehicular wireless communication environments.'
          },
          {
            title: 'Mobility Aware IoT Enabled Vehicular Wireless Communications using Clustering Based Multicast Routing',
            year: null,
            citations: 0,
            venue: 'Periodico Tche Quimica',
            summary: 'Study of mobility-aware multicast routing for IoT-enabled vehicular wireless communications.'
          },
          {
            title: 'Lightweight Novel Trust based Framework for IoT Enabled Wireless Network Communications',
            year: null,
            citations: 0,
            venue: 'Periodicals of Engineering and Natural Sciences (PEN)',
            summary: 'A trust-based framework for secure and lightweight communication in IoT-enabled wireless networks.'
          }
        ]
      },
      experience: [
        {
          role: 'Associate Professor',
          institution: 'MIT WPU, Pune',
          period: 'Current',
          current: true
        },
        {
          role: 'Teaching Experience',
          institution: 'Academic',
          period: '21 Years',
          current: false
        },
        {
          role: 'Research Experience',
          institution: 'Research',
          period: '5 Years',
          current: false
        },
        {
          role: 'Industrial Experience',
          institution: 'Industry',
          period: '2.5 Years',
          current: false
        }
      ],
      contributions: {
        research: [
          'Patent: Quality of Service (QoS) Improvement Routing Protocol for MANET using Ant Colony Optimization. Application No. 201821021892A.',
          'Patent: Secure and QoS Aware Efficient Routing Protocol for Ad Hoc Networks. Application No. 201821021893A.',
          'Patent: System for driver assistance using sensor fusion convolution neural networks. Application No. 201821049058A.',
          'Patent: Mobile Voice Based Vehicle Control System. Application No. 201921001504A.',
          'Patent: Real Time Accident Detection and Alarm Generation System. Application No. 201921000283A.',
          'Published 8 international journal papers, 8 national journal papers, 5 international conference papers, and 2 national conference papers.',
          'Authored New Concept in Network Security. ISBN 978-93-86369-71-0.',
          'Guided 2 Ph.D. students and 12 PG students; evaluated 2 Ph.D. students.'
        ],
        impact: [
          'Computer Network',
          'Computer Security',
          'IoT',
          'MANET',
          'Ad Hoc Networks',
          'Vehicular Wireless Communications',
          'Academic Mentoring'
        ]
      },
      aiInsights: {
        uniqueness: 'Dr. Aparna Atul Junnarkar works across secure and QoS-aware communication systems, including MANET routing, IoT-enabled wireless networks, wireless sensor networks, and vehicular communication. Her profile combines academic teaching, network security research, patent activity, and student mentorship.',
        research_strength: 'Medium',
        focus: 'Academic'
      },
      timeline: [],
      coAuthors: [],
      service: {
        phdGuided: 2,
        phdEvaluated: 2,
        pgGuided: 12,
        memberships: ['ISTE', 'MIEEE', 'MNCSSS'],
        organized: {
          fdpSttp: 10,
          workshops: 10,
          conferencesSeminars: 2
        },
        attended: {
          fdpSttp: 10,
          workshops: 10,
          conferencesSeminars: 10,
          onlineCertificationCourses: 2,
          webinars: 2
        },
        resourcePersonCount: 2,
        reviewerJudgeCount: 3
      },
      online: {
        orcid: null,
        openAlexId: null,
        googleScholar: null
      }
    }
  }
];

// ============================================================
// SEARCH
// ============================================================

searchName.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') performSearch();
});

searchCollege.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') performSearch();
});

btnSearch.addEventListener('click', performSearch);

async function performSearch() {
  const name = searchName.value.trim();
  const college = searchCollege.value.trim();

  if (!name) {
    showToast('Please enter a professor name');
    searchName.focus();
    return;
  }

  const displayQuery = college ? `"${name}" at "${college}"` : `"${name}"`;
  const hardcodedMatches = getSafeHardcodedMatches(name, college);

  searchResults.innerHTML = `
    <div class="search-loading">
      <div class="spinner-sm"></div>
      <div class="search-loading-text">Searching for ${escapeHtml(displayQuery)}…</div>
    </div>
  `;

  try {
    const urls = [];
    urls.push(`${OPENALEX_API}/authors?search=${encodeURIComponent(name)}&per_page=20&mailto=${POLITE_EMAIL}`);

    // Fallback: If name has 3 or more words, also search just first and last name
    // (OpenAlex inverted index requires all words to match, so middle names can miss profiles)
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length >= 3) {
      const firstLast = `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
      urls.push(`${OPENALEX_API}/authors?search=${encodeURIComponent(firstLast)}&per_page=20&mailto=${POLITE_EMAIL}`);
    }

    const responses = await Promise.all(urls.map(url => fetch(url)));
    let allResults = [];

    for (const res of responses) {
      if (res.ok) {
        const data = await res.json();
        if (data.results) {
          allResults = allResults.concat(data.results);
        }
      }
    }

    // Deduplicate by ID
    const seen = new Set();
    let results = [];
    for (const author of allResults) {
      if (!seen.has(author.id)) {
        seen.add(author.id);
        results.push(author);
      }
    }

    // If college is provided, strictly filter for matches in any historical affiliation
    if (college && results.length > 0) {
      const lowerCollege = college.toLowerCase().replace(/[^a-z0-9]/g, '');

      const isSubsequence = (sub, str) => {
        if (!sub) return true;
        let i = 0;
        for (let j = 0; j < str.length && i < sub.length; j++) {
          if (sub[i] === str[j]) i++;
        }
        return i === sub.length;
      };

      results = results.filter(author => {
        const instNames = [];
        if (author.last_known_institutions) {
          author.last_known_institutions.forEach(i => instNames.push(i.display_name || ''));
        }
        if (author.affiliations) {
          author.affiliations.forEach(a => {
            if (a.institution) instNames.push(a.institution.display_name || '');
          });
        }

        return instNames.some(n => {
          const norm = n.toLowerCase().replace(/[^a-z0-9]/g, '');
          return norm.includes(lowerCollege) || isSubsequence(lowerCollege, norm);
        });
      });
      // Sort by works count to put best matches top
      results.sort((a, b) => (b.works_count || 0) - (a.works_count || 0));
    }

    if (hardcodedMatches.length > 0) {
      const manualResults = getSafeHardcodedSearchResults(hardcodedMatches);
      const manualIds = new Set(manualResults.map(result => result.id));
      results = [
        ...manualResults,
        ...results.filter(result => !manualIds.has(result.id))
      ];
    }

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-empty">
          <div class="search-empty-icon">🔍</div>
          <div class="search-empty-title">No professors found</div>
          <div class="search-empty-text">Try a different name or institution. Check the spelling and try again.</div>
        </div>
      `;
      return;
    }

    renderSearchResults(results, results.length);
  } catch (err) {
    console.error('Search error:', err);
    if (hardcodedMatches.length > 0) {
      const manualResults = getSafeHardcodedSearchResults(hardcodedMatches);
      if (manualResults.length > 0) {
        renderSearchResults(manualResults, manualResults.length);
        showToast('Showing saved profile because live search failed', 'success');
        return;
      }
    }

    searchResults.innerHTML = `
      <div class="search-error">
        <div class="search-error-icon">⚠️</div>
        <div class="search-error-title">Search failed</div>
        <div class="search-error-text">${escapeHtml(err.message)}. Please check your internet connection and try again.</div>
      </div>
    `;
  }
}

function renderSearchResults(results, totalCount) {
  const header = `
    <div class="search-results-header">
      <div class="search-results-title">Results</div>
      <div class="search-results-count">${totalCount.toLocaleString()} found · showing top ${results.length}</div>
    </div>
  `;

  const cards = results.map(author => {
    const name = author.display_name || 'Unknown';
    const inst = author.last_known_institutions?.[0]?.display_name || 'Institution not listed';
    const country = author.last_known_institutions?.[0]?.country_code || '';
    const works = author.works_count || 0;
    const citations = author.cited_by_count || 0;
    const hIndex = author.summary_stats?.h_index ?? '–';
    const concepts = (author.x_concepts || [])
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 3)
      .map(c => c.display_name);

    return `
      <div class="result-card" data-author-id="${author.id}">
        <div class="result-avatar">${getInitials(name)}</div>
        <div class="result-info">
          <div class="result-name">${escapeHtml(name)}</div>
          <div class="result-institution">${escapeHtml(inst)}${country ? ' · ' + country : ''}</div>
          <div class="result-stats">
            <div class="result-stat"><strong>${works.toLocaleString()}</strong> works</div>
            <div class="result-stat"><strong>${citations.toLocaleString()}</strong> citations</div>
            <div class="result-stat">h: <strong>${hIndex}</strong></div>
          </div>
          ${concepts.length ? `
            <div class="result-concepts">
              ${concepts.map(c => `<span class="result-concept-tag">${escapeHtml(c)}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <svg class="result-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
      </div>
    `;
  }).join('');

  searchResults.innerHTML = header + cards;

  // Attach click handlers
  document.querySelectorAll('.result-card').forEach(card => {
    card.addEventListener('click', () => {
      const authorId = card.dataset.authorId;
      loadAuthorProfile(authorId);
    });
  });
}

// ============================================================
// LOAD FULL PROFILE
// ============================================================

async function loadAuthorProfile(authorId) {
  const hardcodedProfile = getSafeHardcodedProfileById(authorId);
  if (hardcodedProfile) {
    showLoading('Loading saved profile...', 'Using manually curated academic data');
    currentProfile = cloneProfile(hardcodedProfile);
    renderDashboard(currentProfile);
    hideLoading();
    switchView('dashboard');
    return;
  }

  if (authorId.startsWith('manual:')) {
    showToast('Saved profile is unavailable right now');
    return;
  }

  showLoading('Fetching author profile…', 'Gathering publications, citations & research areas');

  try {
    // OpenAlex IDs look like "https://openalex.org/A12345"
    // We need to convert to API endpoint: "https://api.openalex.org/authors/A12345"
    const shortId = authorId.replace('https://openalex.org/', '');
    const authorApiUrl = `${OPENALEX_API}/authors/${shortId}?mailto=${POLITE_EMAIL}`;
    // Fetch up to 50 works for a better co-author network
    const worksApiUrl = `${OPENALEX_API}/works?filter=author.id:${shortId}&sort=cited_by_count:desc&per_page=50&mailto=${POLITE_EMAIL}`;

    // Fetch author details and top works in parallel
    const [authorRes, worksRes] = await Promise.all([
      fetch(authorApiUrl),
      fetch(worksApiUrl)
    ]);

    if (!authorRes.ok) throw new Error('Failed to fetch author details');
    if (!worksRes.ok) throw new Error('Failed to fetch works');

    const author = await authorRes.json();
    const worksData = await worksRes.json();

    // Transform to our profile format
    currentProfile = transformToProfile(author, worksData.results || []);

    renderDashboard(currentProfile);
    hideLoading();
    switchView('dashboard');

  } catch (err) {
    hideLoading();
    console.error('Profile load error:', err);
    showToast('Failed to load profile: ' + err.message);
  }
}

// ============================================================
// DATA TRANSFORMATION
// ============================================================

function transformToProfile(author, works) {
  // Basic info
  const name = author.display_name || 'Not Available';
  const lastInst = author.last_known_institutions?.[0];
  const institution = lastInst?.display_name || 'Not Available';
  const country = lastInst?.country_code || '';
  const instType = lastInst?.type || '';

  // Research areas from x_concepts
  const researchAreas = (author.x_concepts || [])
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 8)
    .map(c => c.display_name);

  // Publications metrics
  const totalPubs = author.works_count || 0;
  const totalCitations = author.cited_by_count || 0;
  const hIndex = author.summary_stats?.h_index ?? null;
  const i10Index = author.summary_stats?.i10_index ?? null;

  // Top papers
  const topPapers = works.map(w => {
    let summary = '';
    if (w.abstract_inverted_index) {
      summary = reconstructAbstract(w.abstract_inverted_index);
      // Take first 2 sentences
      const sentences = summary.match(/[^.!?]+[.!?]+/g);
      if (sentences && sentences.length > 2) {
        summary = sentences.slice(0, 2).join(' ').trim();
      }
    }

    const venue = w.primary_location?.source?.display_name || '';

    return {
      title: w.title || 'Untitled',
      year: w.publication_year,
      citations: w.cited_by_count || 0,
      summary: summary || null,
      venue: venue || null
    };
  });

  // Experience: build from affiliations
  const experience = buildExperience(author);

  // Notable contributions: derived from top concepts and highly cited work
  const contributions = buildContributions(researchAreas, topPapers, totalCitations);

  // AI Insights: generated algorithmically
  const aiInsights = generateInsights(author, researchAreas, totalPubs, totalCitations, hIndex, works);

  // Online presence
  const orcid = author.orcid || null;
  const openAlexId = author.id || null;

  // Timeline data directly from OpenAlex
  const timeline = (author.counts_by_year || []).sort((a, b) => a.year - b.year);

  // Co-authors network from the fetched works
  const coAuthorCounts = {};
  works.forEach(w => {
    (w.authorships || []).forEach(a => {
      if (a.author && a.author.id && a.author.id !== author.id) {
        const id = a.author.id;
        if (!coAuthorCounts[id]) {
          coAuthorCounts[id] = { id, name: a.author.display_name, count: 0 };
        }
        coAuthorCounts[id].count++;
      }
    });
  });

  const topCoAuthors = Object.values(coAuthorCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return {
    name,
    id: author.id,
    institution,
    country,
    instType,
    researchAreas,
    publications: {
      total: totalPubs,
      citations: totalCitations,
      h_index: hIndex,
      i10_index: i10Index,
      top_papers: topPapers
    },
    experience,
    contributions,
    aiInsights,
    timeline,
    coAuthors: topCoAuthors,
    online: {
      orcid,
      openAlexId,
      googleScholar: null // OpenAlex doesn't provide this directly
    }
  };
}

function reconstructAbstract(invertedIndex) {
  if (!invertedIndex) return '';
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  return words.filter(Boolean).join(' ');
}

function buildExperience(author) {
  const affiliations = author.affiliations || [];
  if (affiliations.length === 0) {
    // Fallback: at least show current institution
    if (author.last_known_institutions?.[0]) {
      return [{
        role: 'Researcher',
        institution: author.last_known_institutions[0].display_name,
        period: 'Current',
        current: true
      }];
    }
    return [];
  }

  // Sort affiliations by importance (number of years active) to de-prioritize incorrectly merged API records
  const sortedAffiliations = [...affiliations].sort((a, b) => {
    const aLen = a.years ? a.years.length : 0;
    const bLen = b.years ? b.years.length : 0;
    if (bLen !== aLen) return bLen - aLen;
    // Tie breaker: most recent year
    const aMax = a.years && a.years.length ? Math.max(...a.years) : 0;
    const bMax = b.years && b.years.length ? Math.max(...b.years) : 0;
    return bMax - aMax;
  });

  const currentYear = new Date().getFullYear();

  return sortedAffiliations.map((aff, idx) => {
    const years = aff.years || [];
    const sorted = [...years].sort((a, b) => a - b);
    const startYear = sorted[0];
    const endYear = sorted[sorted.length - 1];

    // Predict if current based on the end year being very recent
    const isCurrent = endYear >= currentYear - 1;

    let period = 'Not Available';
    if (startYear && endYear) {
      if (isCurrent) {
        period = `${startYear} – Present`;
      } else {
        period = startYear === endYear ? `${startYear}` : `${startYear} – ${endYear}`;
      }
    }

    return {
      role: 'Researcher',
      institution: aff.institution?.display_name || 'Unknown Institution',
      period,
      current: isCurrent
    };
  }).slice(0, 6); // Limit to 6 clearest entries
}

function buildContributions(researchAreas, topPapers, totalCitations) {
  const research = [];
  const impact = [];

  // Research contributions from top papers
  topPapers.slice(0, 3).forEach(p => {
    if (p.citations > 100) {
      research.push(`Highly cited work: "${p.title}" (${p.citations.toLocaleString()} citations)`);
    } else if (p.citations > 0) {
      research.push(`Published "${p.title}" (${p.citations.toLocaleString()} citations)`);
    }
  });

  if (research.length === 0 && topPapers.length > 0) {
    research.push(`Published ${topPapers.length} notable works in their field`);
  }

  // Domains impacted
  researchAreas.slice(0, 4).forEach(area => {
    impact.push(area);
  });

  return { research, impact };
}

function generateInsights(author, researchAreas, totalPubs, totalCitations, hIndex, works) {
  // --- Uniqueness ---
  let uniqueness = '';
  const topConcepts = researchAreas.slice(0, 3).join(', ');
  const institution = author.last_known_institutions?.[0]?.display_name || 'their institution';

  if (researchAreas.length >= 4) {
    uniqueness = `This researcher works across ${researchAreas.length} distinct research domains including ${topConcepts}, demonstrating interdisciplinary breadth at ${institution}.`;
  } else if (researchAreas.length > 0) {
    uniqueness = `This researcher focuses on ${topConcepts} at ${institution}, showing deep specialization in their field.`;
  } else {
    uniqueness = 'Not enough data to determine unique research profile.';
  }

  if (totalCitations > 10000) {
    uniqueness += ` With over ${(totalCitations / 1000).toFixed(0)}K citations, they are among the highly influential researchers in their domain.`;
  } else if (totalCitations > 1000) {
    uniqueness += ` Their work has attracted significant attention with ${totalCitations.toLocaleString()} total citations.`;
  }

  // --- Research Strength ---
  let researchStrength = 'Low';
  if (hIndex !== null) {
    if (hIndex >= 40) researchStrength = 'High';
    else if (hIndex >= 15) researchStrength = 'Medium';
    else researchStrength = 'Low';
  } else {
    // Fallback to citations
    if (totalCitations >= 5000) researchStrength = 'High';
    else if (totalCitations >= 500) researchStrength = 'Medium';
  }

  // --- Focus ---
  // Analyze concepts for industry vs academic signals
  const conceptNames = researchAreas.map(a => a.toLowerCase());
  const industrySignals = ['engineering', 'technology', 'applied', 'industry', 'manufacturing', 'business', 'management', 'software'];
  const academicSignals = ['theory', 'mathematics', 'philosophy', 'physics', 'humanities', 'pure', 'fundamental'];

  let industryScore = 0;
  let academicScore = 0;
  conceptNames.forEach(c => {
    industrySignals.forEach(s => { if (c.includes(s)) industryScore++; });
    academicSignals.forEach(s => { if (c.includes(s)) academicScore++; });
  });

  let focus = 'Academic';
  if (industryScore > academicScore + 1) focus = 'Industry';
  else if (industryScore > 0 && academicScore > 0) focus = 'Both Academic & Industry';

  return {
    uniqueness,
    research_strength: researchStrength,
    focus
  };
}

// ============================================================
// RENDER DASHBOARD
// ============================================================

function renderDashboard(data) {
  renderHero(data);
  renderSummary(data);
  renderMetrics(data);
  renderResearch(data);
  renderPublications(data);
  renderExperience(data);
  renderContributions(data);
  renderOnline(data);
  renderInsights(data);

  // Crazy Features
  renderTimeline(data);
  renderNetwork(data);
}

// ---- 0. Hero ----
function renderHero(data) {
  const hero = document.getElementById('profile-hero');
  hero.innerHTML = `
    <div class="hero-inner anim-up">
      <div class="hero-avatar">${getInitials(data.name)}</div>
      <div class="hero-info">
        <h1 class="hero-name">${escapeHtml(data.name)}</h1>
        <div class="hero-title">${escapeHtml(data.designation || 'Researcher')}</div>
        <div class="hero-institution">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
          ${escapeHtml(data.institution)}
        </div>
        ${data.country ? `<div class="hero-country">📍 ${escapeHtml(data.country)}</div>` : ''}
      </div>
    </div>
  `;
}

// ---- 1. Professional Summary ----
function renderSummary(data) {
  const el = document.getElementById('summary-content');
  const parts = [];

  if (data.designation) {
    const article = /^[aeiou]/i.test(data.designation) ? 'an' : 'a';
    parts.push(`${data.name} is ${article} ${data.designation}${data.institution !== 'Not Available' ? ` at ${data.institution}` : ''}.`);
  } else {
    parts.push(`${data.name} is a researcher${data.institution !== 'Not Available' ? ` at ${data.institution}` : ''}.`);
  }

  if (data.researchAreas.length > 0) {
    const areas = data.researchAreas.slice(0, 4).join(', ');
    parts.push(`Key areas of expertise include ${areas}.`);
  }

  const pubs = data.publications;
  if (pubs.total > 0) {
    parts.push(`With ${pubs.total.toLocaleString()} publications and ${pubs.citations.toLocaleString()} citations, they have established a notable research presence.`);
  }

  if (pubs.h_index) {
    parts.push(`An h-index of ${pubs.h_index} reflects sustained scholarly impact and influence in their field.`);
  }

  if (data.experience.length > 1) {
    const uniqueInsts = [...new Set(data.experience.map(e => e.institution))];
    if (uniqueInsts.length > 1) {
      parts.push(`Their career spans affiliations at ${uniqueInsts.slice(0, 3).join(', ')}${uniqueInsts.length > 3 ? `, and ${uniqueInsts.length - 3} other institutions` : ''}.`);
    }
  }

  const detailSections = [];
  if (data.education?.length) {
    detailSections.push({
      label: 'Education',
      value: data.education.join('; ')
    });
  }
  if (data.contact?.email || data.contact?.phone) {
    const contactItems = [
      data.contact.email ? `Email: ${data.contact.email}` : '',
      data.contact.phone ? `Phone: ${data.contact.phone}` : ''
    ].filter(Boolean);
    detailSections.push({
      label: 'Contact',
      value: contactItems.join(' | ')
    });
  }
  if (data.service) {
    const memberships = data.service.memberships?.length ? `Memberships: ${data.service.memberships.join(', ')}` : '';
    const mentorship = `Guidance: ${data.service.phdGuided || 0} Ph.D. students, ${data.service.pgGuided || 0} PG students`;
    const organized = data.service.organized
      ? `Organized: ${data.service.organized.fdpSttp || 0} FDPs/STTPs, ${data.service.organized.workshops || 0} workshops, ${data.service.organized.conferencesSeminars || 0} conferences/seminars`
      : '';
    detailSections.push({
      label: 'Academic Service',
      value: [mentorship, memberships, organized].filter(Boolean).join(' | ')
    });
  }

  const detailsHtml = detailSections.length ? `
    <div style="margin-top: 14px; display: grid; gap: 8px;">
      ${detailSections.map(section => `
        <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.55;">
          <strong style="color: var(--text-primary);">${escapeHtml(section.label)}:</strong>
          ${escapeHtml(section.value)}
        </div>
      `).join('')}
    </div>
  ` : '';

  const disclaimerText = data.id?.startsWith('manual:')
    ? 'Note: This is a manually curated profile because public academic index coverage is limited.'
    : 'Note: Academic data is automatically aggregated by OpenAlex. Profiles with common names may sometimes contain merged historical affiliations.';
  const disclaimer = `<div style="margin-top: 12px; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 8px;">${disclaimerText}</div>`;
  el.innerHTML = `<p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.75;">${escapeHtml(parts.join(' '))}</p>${detailsHtml}${disclaimer}`;
}

// ---- 2. Research Areas ----
function renderResearch(data) {
  const el = document.getElementById('research-content');
  if (data.researchAreas.length === 0) {
    el.innerHTML = '<p class="not-available">Not Available</p>';
    return;
  }
  el.innerHTML = `
    <div class="research-tags">
      ${data.researchAreas.map(a => `<span class="research-tag">${escapeHtml(a)}</span>`).join('')}
    </div>
  `;
}

// ---- 3. Key Publications ----
function renderPublications(data) {
  const el = document.getElementById('publications-content');
  const papers = data.publications.top_papers;
  const visiblePapers = data.id?.startsWith('manual:') ? papers : papers.slice(0, 5);

  if (papers.length === 0) {
    el.innerHTML = '<p class="not-available">Not Available</p>';
    return;
  }

  el.innerHTML = `
    <div class="pub-list">
      ${visiblePapers.map((p, i) => `
        <div class="pub-item">
          <div class="pub-header">
            <div class="pub-title">${escapeHtml(p.title)}</div>
            ${p.year ? `<span class="pub-year">${p.year}</span>` : ''}
          </div>
          ${p.venue ? `<div class="pub-venue">${escapeHtml(p.venue)}</div>` : ''}
          <div class="pub-citations">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            <strong>${p.citations.toLocaleString()}</strong> citations
          </div>
          ${p.summary ? `
            <button class="btn-summary-toggle" onclick="toggleSummary('summary-${i}', this)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              AI Abstract Summary
            </button>
            <div id="summary-${i}" class="pub-summary-box">
              <div class="pub-summary-sparkle">✨</div>
              ${highlightTerms(escapeHtml(p.summary))}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function highlightTerms(text) {
  const terms = ['machine learning', 'artificial intelligence', 'deep learning', 'neural network', 'iot', 'internet of things', 'blockchain', 'algorithm', 'data', 'cloud', 'security'];
  let highlighted = text;
  terms.forEach(term => {
    const regex = new RegExp(`\\b(${term})\\b`, 'gi');
    highlighted = highlighted.replace(regex, '<span class="text-highlight">$1</span>');
  });
  return highlighted;
}

// Attach to window so it works with inline onclick
window.toggleSummary = function (id, btn) {
  const box = document.getElementById(id);
  box.classList.toggle('active');
  btn.classList.toggle('active');
};

// ---- 4. Academic Metrics ----
function renderMetrics(data) {
  const el = document.getElementById('metrics-content');
  const pubs = data.publications;

  const metrics = [
    { label: 'Publications', value: pubs.total, color: 'purple' },
    { label: 'Citations', value: pubs.citations, color: 'cyan' },
    { label: 'h-index', value: pubs.h_index, color: 'emerald' },
    { label: 'i10-index', value: pubs.i10_index, color: 'amber' }
  ];

  el.innerHTML = metrics.map(m => `
    <div class="metric-item">
      <div class="metric-value metric-value--${m.color}" data-target="${m.value != null ? m.value : ''}">${m.value != null ? m.value.toLocaleString() : 'N/A'}</div>
      <div class="metric-label">${m.label}</div>
    </div>
  `).join('');

  animateCounters();
}

function animateCounters() {
  document.querySelectorAll('.metric-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    if (isNaN(target)) return;

    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }

    requestAnimationFrame(tick);
  });
}

// ---- 5. Experience ----
function renderExperience(data) {
  const el = document.getElementById('experience-content');
  if (data.experience.length === 0) {
    el.innerHTML = '<p class="not-available">Not Available</p>';
    return;
  }

  el.innerHTML = `
    <div class="timeline">
      ${data.experience.map(e => `
        <div class="timeline-item ${e.current ? 'timeline-item--current' : ''}">
          <div class="timeline-role">
            ${escapeHtml(e.role)}
            ${e.current ? '<span class="timeline-current-badge">Current</span>' : ''}
          </div>
          <div class="timeline-org">${escapeHtml(e.institution)}</div>
          <div class="timeline-period">${escapeHtml(e.period)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ---- 6. Notable Contributions ----
function renderContributions(data) {
  const el = document.getElementById('contributions-content');
  const c = data.contributions;

  if ((!c.research || !c.research.length) && (!c.impact || !c.impact.length)) {
    el.innerHTML = '<p class="not-available">Not Available</p>';
    return;
  }

  let html = '';

  if (c.research.length) {
    html += `<div class="contribution-section-title">Major Research Contributions</div>`;
    html += `<div class="contributions-list">${c.research.map(r => `
      <div class="contribution-item">
        <div class="contribution-icon"></div>
        <div class="contribution-text">${escapeHtml(r)}</div>
      </div>
    `).join('')}</div>`;
  }

  if (c.impact.length) {
    html += `<div class="contribution-section-title">Domains of Impact</div>`;
    html += `<div class="contributions-list">${c.impact.map(r => `
      <div class="contribution-item">
        <div class="contribution-icon"></div>
        <div class="contribution-text">${escapeHtml(r)}</div>
      </div>
    `).join('')}</div>`;
  }

  el.innerHTML = html;
}

// ---- 7. Online Presence ----
function renderOnline(data) {
  const el = document.getElementById('online-content');
  const arrowSVG = `<svg class="online-link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>`;
  const links = [];

  if (data.contact?.email) {
    links.push({
      name: 'Email',
      url: `mailto:${data.contact.email}`,
      displayUrl: data.contact.email,
      icon: 'web',
      emoji: '@'
    });
  }

  if (data.contact?.phone) {
    const phoneHref = data.contact.phone.replace(/[^0-9+]/g, '');
    links.push({
      name: 'Phone',
      url: `tel:${phoneHref}`,
      displayUrl: data.contact.phone,
      icon: 'web',
      emoji: 'TEL'
    });
  }

  if (data.online.openAlexId) {
    links.push({
      name: 'OpenAlex Profile',
      url: data.online.openAlexId,
      icon: 'openalex',
      emoji: '📚'
    });
  }

  if (data.online.orcid) {
    links.push({
      name: 'ORCID',
      url: data.online.orcid,
      icon: 'orcid',
      emoji: '🆔'
    });
  }

  // Use an exact Scholar URL for manual profiles when available.
  const scholarSearchUrl = data.online.googleScholar || `https://scholar.google.com/scholar?q=author:"${encodeURIComponent(data.name)}"`;
  links.push({
    name: data.online.googleScholar ? 'Google Scholar Profile' : 'Search on Google Scholar',
    url: scholarSearchUrl,
    icon: 'scholar',
    emoji: '🎓'
  });

  if (links.length === 0) {
    el.innerHTML = '<p class="not-available">Not Available</p>';
    return;
  }

  el.innerHTML = `
    <div class="online-links">
      ${links.map(l => `
        <a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" class="online-link">
          <div class="online-link-icon online-link-icon--${l.icon}">${l.emoji}</div>
          <div>
            <div class="online-link-name">${escapeHtml(l.name)}</div>
            <div class="online-link-url">${escapeHtml(l.displayUrl || l.url)}</div>
          </div>
          ${arrowSVG}
        </a>
      `).join('')}
    </div>
  `;
}

// ---- 8. AI Insights ----
function renderInsights(data) {
  const el = document.getElementById('insights-content');
  const insights = data.aiInsights;

  if (!insights) {
    el.innerHTML = '<p class="not-available">Not Available</p>';
    return;
  }

  const strength = insights.research_strength || 'Not Available';
  const strengthLower = strength.toLowerCase();
  const strengthClass = strengthLower === 'high' ? 'high' : (strengthLower === 'medium' ? 'medium' : 'low');
  const focus = insights.focus || 'Not Available';

  el.innerHTML = `
    <div class="insights-grid">
      <div class="insight-item insight-item--full">
        <div class="insight-label">What Makes This Professor Unique?</div>
        <div class="insight-value">${escapeHtml(insights.uniqueness)}</div>
      </div>
      <div class="insight-item">
        <div class="insight-label">Research Strength</div>
        <div class="insight-value">
          <span class="strength-badge strength-badge--${strengthClass}">
            ${strengthClass === 'high' ? '🔥' : (strengthClass === 'medium' ? '⚡' : '📌')}
            ${escapeHtml(strength)}
          </span>
        </div>
      </div>
      <div class="insight-item">
        <div class="insight-label">Focus Area</div>
        <div class="insight-value">
          <span class="focus-badge">
            ${focus.toLowerCase().includes('industry') ? '🏢' : '🎓'}
            ${escapeHtml(focus)}
          </span>
        </div>
      </div>
      <div class="insight-item">
        <div class="insight-label">Profile Completeness</div>
        <div class="insight-value">
          <span class="strength-badge strength-badge--${getCompletenessClass(data)}">
            ${getCompletenessEmoji(data)} ${getCompletenessScore(data)}%
          </span>
        </div>
      </div>
    </div>
  `;
}

// ---- CRAZY FEATURES: Timeline Chart ----
let timelineChartInstance = null;

function renderTimeline(data) {
  const ctx = document.getElementById('timeline-chart').getContext('2d');

  if (timelineChartInstance) {
    timelineChartInstance.destroy();
  }

  if (!data.timeline || data.timeline.length === 0) {
    // Hide chart or show N/A
    return;
  }

  const labels = data.timeline.map(t => t.year);
  const works = data.timeline.map(t => t.works_count);
  const citations = data.timeline.map(t => t.cited_by_count);

  timelineChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Publications',
          data: works,
          backgroundColor: '#1e3a8a', // Lighter Oxford Blue
          borderRadius: 4,
          order: 2
        },
        {
          label: 'Citations',
          data: citations,
          type: 'line',
          borderColor: '#b45309', // Deep Gold/Brass
          backgroundColor: 'rgba(180, 83, 9, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#fff',
          pointRadius: 3,
          fill: true,
          tension: 0.4,
          order: 1,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          labels: { color: '#475569', font: { family: 'Inter' } }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#0f172a',
          bodyColor: '#1e293b',
          titleFont: { family: 'Inter', size: 13, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 12 },
          displayColors: true,
          padding: 10,
          cornerRadius: 4,
          borderColor: '#e2e8f0',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
          ticks: { color: '#64748b', font: { family: 'Inter' } }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
          ticks: { color: '#64748b', font: { family: 'Inter' } },
          title: { display: true, text: 'Publications', color: '#64748b' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#b45309', font: { family: 'Inter' } },
          title: { display: true, text: 'Citations', color: '#b45309' }
        }
      }
    }
  });
}

// ---- CRAZY FEATURES: Network Graph ----
function renderNetwork(data) {
  const container = document.getElementById('network-content');

  if (!data.coAuthors || data.coAuthors.length === 0) {
    container.innerHTML = '<p class="not-available">Not enough collaboration data</p>';
    return;
  }

  // Create nodes
  const nodes = [];
  // Central node (the professor)
  nodes.push({
    id: data.id,
    label: data.name,
    color: { background: '#0f172a', border: '#1e3a8a' },
    font: { color: '#fff', face: 'Inter' },
    size: 25,
    shape: 'dot'
  });

  const edges = [];

  data.coAuthors.forEach(co => {
    // Co-author node
    nodes.push({
      id: co.id,
      label: co.name,
      color: { background: '#ffffff', border: '#1e3a8a' },
      font: { color: '#475569', face: 'Inter', size: 12 },
      size: 10 + Math.min(co.count * 2, 10),
      shape: 'dot'
    });

    // Edge connecting them
    edges.push({
      from: data.id,
      to: co.id,
      value: co.count,
      title: `${co.count} shared publications`,
      color: { color: 'rgba(30, 58, 138, 0.2)', highlight: '#1e3a8a' }
    });
  });

  const networkData = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };

  const options = {
    physics: {
      forceAtlas2Based: { gravitationalConstant: -30, centralGravity: 0.005, springLength: 100, springConstant: 0.18 },
      maxVelocity: 146,
      solver: 'forceAtlas2Based',
      timestep: 0.35,
      stabilization: { iterations: 150 }
    },
    nodes: { borderWidth: 2, shadow: { enabled: true, color: 'rgba(0, 0, 0, 0.05)', size: 5 } },
    edges: { smooth: { type: 'continuous' } },
    interaction: { hover: true, tooltipDelay: 200 }
  };

  new vis.Network(container, networkData, options);
}

function getCompletenessScore(data) {
  const checks = [
    data.name !== 'Not Available',
    data.institution !== 'Not Available',
    data.researchAreas.length > 0,
    data.publications.total > 0,
    data.publications.citations > 0,
    data.publications.h_index != null,
    data.publications.i10_index != null,
    data.publications.top_papers.length > 0,
    data.experience.length > 0,
    data.online.orcid != null,
    data.contributions.research.length > 0,
    data.aiInsights != null
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function getCompletenessClass(data) {
  const s = getCompletenessScore(data);
  if (s >= 75) return 'high';
  if (s >= 50) return 'medium';
  return 'low';
}

function getCompletenessEmoji(data) {
  const s = getCompletenessScore(data);
  if (s >= 75) return '✅';
  if (s >= 50) return '🟡';
  return '🔴';
}

// ============================================================
// VIEW MANAGEMENT
// ============================================================

btnBack.addEventListener('click', () => switchView('search'));

function switchView(view) {
  if (view === 'dashboard') {
    searchView.classList.remove('active');
    dashboardView.classList.add('active');
    window.scrollTo(0, 0);
    // Re-trigger animations
    document.querySelectorAll('.anim-up').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });
  } else {
    dashboardView.classList.remove('active');
    searchView.classList.add('active');
    window.scrollTo(0, 0);
  }
}

// ============================================================
// EXPORT
// ============================================================

btnExport.addEventListener('click', () => {
  if (!currentProfile) return;
  exportProfile(currentProfile);
});

function exportProfile(data) {
  showToast('Generating HD PDF... Please wait', 'success');
  const element = document.getElementById('pdf-content');

  // Configure html2pdf options
  const opt = {
    margin: [10, 10, 10, 10], // top, left, bottom, right
    filename: `scholarz-${data.name.replace(/\\s+/g, '-').toLowerCase()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#06060e' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Run html2pdf
  html2pdf().set(opt).from(element).save().then(() => {
    // Don't need to do anything after save
    showToast('Profile exported as PDF!', 'success');
  }).catch(err => {
    console.error('PDF export error:', err);
    showToast('Failed to export PDF', 'error');
  });
}

// ============================================================
// UTILITIES
// ============================================================

function getSafeHardcodedMatches(name, college) {
  try {
    return getHardcodedProfileEntries(name, college);
  } catch (err) {
    console.warn('Hardcoded profile matching skipped:', err);
    return [];
  }
}

function getSafeHardcodedSearchResults(entries) {
  try {
    return entries.map(createHardcodedSearchResult).filter(Boolean);
  } catch (err) {
    console.warn('Hardcoded search results skipped:', err);
    return [];
  }
}

function getSafeHardcodedProfileById(authorId) {
  try {
    return getHardcodedProfileById(authorId);
  } catch (err) {
    console.warn('Hardcoded profile load skipped:', err);
    return null;
  }
}

function getHardcodedProfileEntries(name, college) {
  return HARDCODED_PROFILES.filter(entry => hardcodedProfileMatches(entry, name, college));
}

function getHardcodedProfileById(authorId) {
  const entry = HARDCODED_PROFILES.find(item => getHardcodedProfileId(item) === authorId);
  if (!entry) return null;
  return hydrateHardcodedProfile(entry.profile || {}, getHardcodedProfileId(entry));
}

function hardcodedProfileMatches(entry, name, college) {
  const profile = entry.profile || {};
  const normalizedName = normalizeSearchValue(name);
  if (!normalizedName) return false;

  const matchNames = entry.matchNames || [profile.name];
  const nameMatches = matchNames.some(candidate => {
    const normalizedCandidate = normalizeSearchValue(candidate);
    return normalizedCandidate
      && (normalizedCandidate === normalizedName
        || normalizedCandidate.includes(normalizedName)
        || normalizedName.includes(normalizedCandidate));
  });

  if (!nameMatches) return false;
  if (!college) return true;

  const normalizedCollege = normalizeSearchValue(college);
  const experienceInstitutions = (profile.experience || []).map(item => item.institution);
  const matchInstitutions = entry.matchInstitutions || [
    profile.institution,
    ...experienceInstitutions
  ];

  return matchInstitutions.some(candidate => {
    const normalizedCandidate = normalizeSearchValue(candidate);
    return normalizedCandidate
      && (normalizedCandidate.includes(normalizedCollege)
        || normalizedCollege.includes(normalizedCandidate)
        || isSubsequence(normalizedCollege, normalizedCandidate));
  });
}

function createHardcodedSearchResult(entry) {
  const profile = hydrateHardcodedProfile(entry.profile || {}, getHardcodedProfileId(entry));
  const papers = profile.publications.top_papers || [];
  const citations = profile.publications.citations
    ?? papers.reduce((sum, paper) => sum + (paper.citations || 0), 0);

  return {
    id: profile.id,
    display_name: profile.name,
    last_known_institutions: [
      {
        display_name: profile.institution,
        country_code: profile.country,
        type: profile.instType
      }
    ],
    works_count: profile.publications.total ?? papers.length,
    cited_by_count: citations,
    summary_stats: {
      h_index: profile.publications.h_index,
      i10_index: profile.publications.i10_index
    },
    x_concepts: profile.researchAreas.map((area, index) => ({
      display_name: area,
      score: 1 - (index * 0.05)
    })),
    isHardcoded: true
  };
}

function hydrateHardcodedProfile(profile, id) {
  const publications = profile.publications || {};
  const topPapers = publications.top_papers || [];
  const researchAreas = profile.researchAreas || [];
  const contributions = profile.contributions || {};
  const online = profile.online || {};

  return {
    name: profile.name || 'Not Available',
    id: profile.id || id,
    designation: profile.designation || null,
    institution: profile.institution || 'Not Available',
    country: profile.country || '',
    instType: profile.instType || '',
    contact: profile.contact || {},
    education: profile.education || [],
    researchAreas,
    publications: {
      total: publications.total ?? topPapers.length,
      citations: publications.citations ?? topPapers.reduce((sum, paper) => sum + (paper.citations || 0), 0),
      h_index: publications.h_index ?? null,
      i10_index: publications.i10_index ?? null,
      top_papers: topPapers
    },
    experience: profile.experience || [],
    contributions: {
      research: contributions.research || [],
      impact: contributions.impact || researchAreas
    },
    aiInsights: profile.aiInsights || {
      uniqueness: 'Manual profile created because public academic index coverage is limited.',
      research_strength: 'Low',
      focus: 'Academic'
    },
    timeline: profile.timeline || [],
    coAuthors: profile.coAuthors || [],
    service: profile.service || null,
    online: {
      orcid: online.orcid || null,
      openAlexId: online.openAlexId || null,
      googleScholar: online.googleScholar || null
    }
  };
}

function getHardcodedProfileId(entry) {
  return entry.id || entry.profile?.id || `manual:${normalizeSearchValue(entry.profile?.name || 'profile')}`;
}

function normalizeSearchValue(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^(dr|prof|professor|mr|ms|mrs)\.?\s+/i, '')
    .replace(/[^a-z0-9]/g, '');
}

function isSubsequence(sub, str) {
  if (!sub) return true;
  let i = 0;
  for (let j = 0; j < str.length && i < sub.length; j++) {
    if (sub[i] === str[j]) i++;
  }
  return i === sub.length;
}

function cloneProfile(profile) {
  return JSON.parse(JSON.stringify(profile));
}

function getInitials(name) {
  if (!name) return '?';
  return name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, type = 'error') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast--success' : ''}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function showLoading(text = 'Loading…', subtext = '') {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.id = 'loading-overlay';
  overlay.innerHTML = `
    <div class="spinner"></div>
    <div class="loading-text">${escapeHtml(text)}</div>
    ${subtext ? `<div class="loading-sub-text">${escapeHtml(subtext)}</div>` : ''}
  `;
  document.body.appendChild(overlay);
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.remove();
}