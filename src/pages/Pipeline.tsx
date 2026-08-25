import { Link } from 'react-router-dom'
import { PIPELINE_STAGES, STAGE_LABEL } from '../data/pipeline'
import type { PipelineStage } from '../data/types'
import { useRecruiter } from '../state/RecruiterContext'

export function PipelinePage() {
  const { pipeline, candidates, requirements, setStage, removeFromPipeline } = useRecruiter()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl tracking-tight">Interview pipeline</h1>
        <p className="mt-2 max-w-2xl text-mute">
          Shortlisted → Interview → Offer → Hired. Move people forward as conversations progress.
        </p>
      </div>

      {pipeline.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-serif text-2xl">Nothing in motion yet</p>
          <p className="mt-2 text-sm text-mute">Shortlist a ranked match and they will land in the first column.</p>
          <Link
            to="/recruiter/requirements/req-data-analyst/matches"
            className="mt-6 inline-block rounded-full bg-ink px-4 py-2 text-sm text-mist"
          >
            Open Data Analyst matches
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-4">
          {PIPELINE_STAGES.map((stage) => {
            const cards = pipeline.filter((p) => p.stage === stage)
            return (
              <section key={stage} className="rounded-2xl border border-line bg-mist/50 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-sm font-medium">{STAGE_LABEL[stage]}</h2>
                  <span className="text-xs text-mute">{cards.length}</span>
                </div>
                <div className="space-y-3">
                  {cards.map((entry) => {
                    const person = candidates.find((c) => c.id === entry.candidateId)
                    const req = requirements.find((r) => r.id === entry.requirementId)
                    if (!person) return null
                    const idx = PIPELINE_STAGES.indexOf(stage)
                    const next = PIPELINE_STAGES[idx + 1] as PipelineStage | undefined
                    return (
                      <article key={`${entry.candidateId}-${entry.requirementId}`} className="rounded-xl border border-line bg-white p-4">
                        <p className="font-medium">{person.name}</p>
                        <p className="text-xs text-mute">{req?.role ?? 'Requirement'}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {next ? (
                            <button
                              type="button"
                              onClick={() => setStage(person.id, entry.requirementId, next)}
                              className="rounded-full bg-ink px-3 py-1 text-xs text-mist hover:bg-ink-2"
                            >
                              Move to {STAGE_LABEL[next]}
                            </button>
                          ) : (
                            <span className="text-xs text-teal">Hired</span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFromPipeline(person.id, entry.requirementId)}
                            className="rounded-full border border-line px-3 py-1 text-xs hover:border-ink"
                          >
                            Remove
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
