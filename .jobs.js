const fs = require('fs');

const {
  BASEURL: baseUrl,
  PIPELINE: pipeline,
  TEAM: team = 'main'
} = process.env;

const font = 'Monaco';
const ok = 'succeeded';

const format = (entries = {}) =>
  Object.entries(entries)
    .map(e => e.join('='))
    .join(' ');

const writeLine = (label, opts) => {
  const formatting = opts ? ` | ${format({ font, ...opts })}` : '';
  const line = `${label}${formatting}`.trim();
  process.stdout.write(`${line}\n`);
};

const getHref = ({ job_name, name }) =>
  `${baseUrl}/teams/${team}/pipelines/${pipeline}/jobs/${job_name}/builds/${name}`;

const jobs = JSON.parse(fs.readFileSync(0, 'utf-8'));

jobs.forEach(({ name, finished_build, next_build }, i) => {
  const { status, end_time } = finished_build;
  const color = !!next_build ? 'yellow' : status === ok ? 'green' : 'red';
  jobs[i] = { name, status, end_time, color, href: getHref(finished_build) };
});

const allGreen = jobs.every(({ status }) => status === ok);

// label
writeLine(pipeline, { color: allGreen ? 'green' : 'red' });

// dropdown
writeLine('---');
jobs
  .sort((b, a) => (b.status === ok ? 1 : a.status === ok ? -1 : 0))
  .forEach(({ name, status, end_time, ...opts }) => {
    if (status === ok) writeLine(name, opts);
    else {
      const since = new Date(end_time * 1000);
      writeLine('---');
      writeLine(name, opts);
      writeLine(
        `since ${since.toLocaleTimeString()} (${Math.floor(
          (Date.now() - since) / (1000 * 60)
        )} mins)`
      );
      writeLine('---');
    }
  });
