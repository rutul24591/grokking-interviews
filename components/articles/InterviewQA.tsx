"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { classNames } from "@/lib/classNames";

export type InterviewQuestion = {
  question: string;
  answer: string;
  followUp?: string[];
};

type InterviewQAProps = {
  questions: InterviewQuestion[];
};

export function InterviewQA({ questions }: InterviewQAProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="my-8">
      <h2 className="mb-6 text-2xl font-bold text-heading">
        🎯 Interview Questions &amp; Answers
      </h2>

      <div className="space-y-4">
        {questions.map((qa, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-theme bg-panel-soft"
          >
            <button
              type="button"
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
              className={classNames(
                "flex w-full items-center justify-between px-6 py-4 text-left transition",
                "hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              )}
              aria-expanded={expandedIndex === index}
            >
              <span className="pr-4 font-medium text-heading">
                <span className="mr-3 text-accent">Q{index + 1}.</span>
                {qa.question}
              </span>
              <motion.span
                initial={false}
                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-muted"
                aria-hidden="true"
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-theme px-6 py-4">
                    <div className="mb-4 text-body leading-relaxed">
                      <span className="font-semibold text-accent">A:</span>{" "}
                      {qa.answer}
                    </div>

                    {qa.followUp && qa.followUp.length > 0 && (
                      <div className="rounded-lg bg-panel p-4">
                        <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                          Follow-up Questions
                        </div>
                        <ul className="space-y-2">
                          {qa.followUp.map((followUp, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-body"
                            >
                              <span className="mt-1 text-accent">•</span>
                              <span>{followUp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Interview Tips */}
      <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-6">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-heading">
          <span>💡</span> Interview Tips
        </h3>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-accent">✓</span>
            <span>
              Start with a high-level overview before diving into details
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-accent">✓</span>
            <span>
              Discuss trade-offs explicitly - there's rarely one "right" answer
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-accent">✓</span>
            <span>
              Use real-world examples from your experience when possible
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-accent">✓</span>
            <span>
              Ask clarifying questions to understand the problem constraints
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
