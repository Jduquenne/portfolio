import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// This document is rendered only at build time (see scripts/build-cv.mts),
// so fonts are read from a local directory rather than a served URL.
const FONT_BASE = process.env.CV_FONT_DIR ?? "scripts/fonts";

Font.register({
  family: "Geist Mono",
  fonts: [
    { src: `${FONT_BASE}/geist-mono-400.woff`, fontWeight: 400 },
    { src: `${FONT_BASE}/geist-mono-500.woff`, fontWeight: 500 },
    { src: `${FONT_BASE}/geist-mono-700.woff`, fontWeight: 700 },
  ],
});

// Only the regular weight is used — descriptions are Inter 400, everything
// with emphasis is Geist Mono.
Font.register({ family: "Inter", src: `${FONT_BASE}/inter-400.woff` });

Font.registerHyphenationCallback((word) => [word]);

const C = {
  ink: "#0f172a",
  soft: "#334155",
  muted: "#64748b",
  line: "#e2e8f0",
  accent: "#0284c7",
  paper: "#ffffff",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.paper,
    color: C.ink,
    fontFamily: "Inter",
    fontSize: 9,
    lineHeight: 1.45,
    paddingVertical: 36,
    paddingHorizontal: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    paddingBottom: 16,
    marginBottom: 18,
  },
  avatarWrap: { width: 82, height: 82, position: "relative" },
  avatarBox: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: C.line,
  },
  avatar: { width: "100%", height: "100%", objectFit: "cover" },
  corner: {
    position: "absolute",
    width: 7,
    height: 7,
    borderColor: C.accent,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 },
  name: {
    fontFamily: "Geist Mono",
    fontWeight: 700,
    fontSize: 19,
    lineHeight: 1.2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: "Geist Mono",
    fontSize: 8.5,
    lineHeight: 1.3,
    color: C.muted,
    marginTop: 6,
  },
  meta: {
    fontFamily: "Geist Mono",
    fontSize: 8,
    lineHeight: 1.3,
    color: C.muted,
    marginTop: 2,
  },
  thesis: {
    fontFamily: "Geist Mono",
    fontWeight: 500,
    fontSize: 9.5,
    lineHeight: 1.5,
    marginTop: 10,
    maxWidth: 340,
  },
  body: { flexDirection: "row", alignItems: "stretch" },
  colLeft: {
    width: "35%",
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: C.line,
  },
  colRight: { width: "65%", paddingLeft: 16 },
  section: { marginBottom: 15 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  },
  label: {
    fontFamily: "Geist Mono",
    fontSize: 7,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    color: C.accent,
  },
  labelRule: { flexGrow: 1, height: 1, backgroundColor: C.line },
  link: {
    color: C.ink,
    textDecoration: "none",
    fontFamily: "Geist Mono",
    fontSize: 8,
    marginBottom: 2,
  },
  stackCat: {
    fontFamily: "Geist Mono",
    fontSize: 6.5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: C.muted,
    marginTop: 5,
  },
  stackItems: { fontFamily: "Geist Mono", fontSize: 7.5, lineHeight: 1.5 },
  passionItem: { marginTop: 6 },
  passionTitle: { fontFamily: "Geist Mono", fontWeight: 700, fontSize: 8 },
  passionLabel: { fontSize: 7, color: C.muted, lineHeight: 1.4, marginTop: 1 },
  headerMain: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 12 },
  availableRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  availableDot: { width: 4, height: 4, backgroundColor: C.accent },
  available: {
    fontFamily: "Geist Mono",
    fontSize: 7.5,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: C.accent,
  },
  expItem: { flexDirection: "row", gap: 7, marginBottom: 11 },
  expDot: { width: 4, height: 4, backgroundColor: C.accent, marginTop: 3.5 },
  expHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 8,
  },
  expRole: { fontFamily: "Geist Mono", fontWeight: 700, fontSize: 8.5, flex: 1 },
  expCompany: { fontFamily: "Geist Mono", fontWeight: 400, color: C.muted },
  expPeriod: { fontFamily: "Geist Mono", fontSize: 7, color: C.muted },
  expDesc: { fontSize: 8, color: C.soft, marginTop: 2 },
  expStack: {
    fontFamily: "Geist Mono",
    fontSize: 6.5,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: C.muted,
    marginTop: 3,
  },
  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 5,
  },
  eduTitle: { fontFamily: "Geist Mono", fontSize: 8, fontWeight: 500, flex: 1 },
  eduSchool: { fontWeight: 400, color: C.muted },
  eduPeriod: { fontFamily: "Geist Mono", fontSize: 7, color: C.muted },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 4,
  },
  infoKey: { fontFamily: "Geist Mono", fontSize: 7.5 },
  infoValue: { fontFamily: "Geist Mono", fontSize: 7.5, color: C.muted },
  projects: { fontSize: 8, color: C.soft },
  projectsLink: { fontFamily: "Geist Mono", color: C.accent },
});

export interface CvData {
  name: string;
  subtitle: string;
  age: string;
  thesis: string;
  avatarSrc: string;
  contact: {
    email: string;
    github: string;
    githubDisplay: string;
    linkedin: string;
    linkedinDisplay: string;
  };
  stack: { label: string; items: string }[];
  passions: { title: string; label: string }[];
  languages: { name: string; level: string }[];
  licence: string;
  experiences: {
    role: string;
    company: string;
    period: string;
    description: string;
    stack: string;
  }[];
  education: { title: string; school: string; period: string }[];
  labels: {
    contact: string;
    stack: string;
    passions: string;
    experience: string;
    education: string;
    languages: string;
    licence: string;
    projects: string;
    projectsHint: string;
    available: string;
  };
}

function SectionLabel({ text }: { text: string }) {
  return (
    <View style={s.labelRow}>
      <Text style={s.label}>{text}</Text>
      <View style={s.labelRule} />
    </View>
  );
}

// Fixed so identical inputs produce a byte-identical PDF.
const STAMP = new Date("2024-01-01T00:00:00Z");

export function CvDocument({ data }: { data: CvData }) {
  return (
    <Document
      title={`${data.name} — CV`}
      author={data.name}
      subject={data.subtitle}
      creator="portfolio-jd"
      producer="portfolio-jd"
      creationDate={STAMP}
      modificationDate={STAMP}
    >
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.avatarWrap}>
            <View style={s.avatarBox}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={data.avatarSrc} style={s.avatar} />
            </View>
            <View style={[s.corner, s.cornerTL]} />
            <View style={[s.corner, s.cornerTR]} />
            <View style={[s.corner, s.cornerBL]} />
            <View style={[s.corner, s.cornerBR]} />
          </View>
          <View style={s.headerMain}>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{data.name}</Text>
              <Text style={s.subtitle}>{data.subtitle}</Text>
              <Text style={s.meta}>{data.age}</Text>
              <Text style={s.thesis}>{data.thesis}</Text>
            </View>
            <View style={s.availableRow}>
              <View style={s.availableDot} />
              <Text style={s.available}>{data.labels.available}</Text>
            </View>
          </View>
        </View>

        <View style={s.body}>
          <View style={s.colLeft}>
            <View style={s.section}>
              <SectionLabel text={data.labels.contact} />
              <Link src={`mailto:${data.contact.email}`} style={s.link}>
                {data.contact.email}
              </Link>
              <Link src={data.contact.github} style={s.link}>
                {data.contact.githubDisplay}
              </Link>
              <Link src={data.contact.linkedin} style={s.link}>
                {data.contact.linkedinDisplay}
              </Link>
            </View>

            <View style={s.section}>
              <SectionLabel text={data.labels.stack} />
              {data.stack.map((category) => (
                <View key={category.label}>
                  <Text style={s.stackCat}>{category.label}</Text>
                  <Text style={s.stackItems}>{category.items}</Text>
                </View>
              ))}
            </View>

            <View style={s.section}>
              <SectionLabel text={data.labels.passions} />
              {data.passions.map((passion) => (
                <View key={passion.title} style={s.passionItem}>
                  <Text style={s.passionTitle}>{passion.title}</Text>
                  <Text style={s.passionLabel}>{passion.label}</Text>
                </View>
              ))}
            </View>

            <View style={s.section}>
              <SectionLabel text={data.labels.languages} />
              {data.languages.map((language) => (
                <View key={language.name} style={s.infoRow}>
                  <Text style={s.infoKey}>{language.name}</Text>
                  <Text style={s.infoValue}>{language.level}</Text>
                </View>
              ))}
            </View>

            <View style={s.section}>
              <SectionLabel text={data.labels.licence} />
              <Text style={s.infoKey}>{data.licence}</Text>
            </View>
          </View>

          <View style={s.colRight}>
            <View style={s.section}>
              <SectionLabel text={data.labels.experience} />
              {data.experiences.map((exp, index) => (
                <View key={index} style={s.expItem}>
                  <View style={s.expDot} />
                  <View style={{ flex: 1 }}>
                    <View style={s.expHead}>
                      <Text style={s.expRole}>
                        {exp.role}
                        <Text style={s.expCompany}>{`  @ ${exp.company}`}</Text>
                      </Text>
                      <Text style={s.expPeriod}>{exp.period}</Text>
                    </View>
                    <Text style={s.expDesc}>{exp.description}</Text>
                    <Text style={s.expStack}>{exp.stack}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={s.section}>
              <SectionLabel text={data.labels.education} />
              {data.education.map((entry, index) => (
                <View key={index} style={s.eduRow}>
                  <Text style={s.eduTitle}>
                    {entry.title}
                    {entry.school ? (
                      <Text style={s.eduSchool}>{`  ·  ${entry.school}`}</Text>
                    ) : null}
                  </Text>
                  <Text style={s.eduPeriod}>{entry.period}</Text>
                </View>
              ))}
            </View>

            <View style={s.section}>
              <SectionLabel text={data.labels.projects} />
              <Text style={s.projects}>
                {`${data.labels.projectsHint} `}
                <Link src={data.contact.github} style={s.projectsLink}>
                  {data.contact.githubDisplay}
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
