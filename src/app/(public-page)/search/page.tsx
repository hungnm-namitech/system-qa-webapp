'use client';
import DialogDeleteManual from '@/app/components/dialog-delete-manual';
import Notification from '@/app/components/notification';
import { Link, TrashCan } from '@/app/components/svg';
import { STATUS_MANUAL, STATUS_MANUAL_JP } from '@/app/constants/manual.const';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import * as Manual from '@/app/api/entities/manual';
import SkeletonManual from '@/app/components/skeleton-manual';
import Progressbar from '@/app/components/progress-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueries } from '@tanstack/react-query';
import TinySegmenter from 'tiny-segmenter';

const highlightImportantText = (
  text: string,
  searchTerm: string,
  allDocuments: string[],
): JSX.Element => {
  const segmenter = new TinySegmenter();
  if (!searchTerm.trim()) {
    return <span>{text}</span>;
  }

  const searchTokens = tokenizeAndRemoveStopWords(searchTerm);
  const textTokens = segmenter.segment(text);

  const tfidfScores = textTokens.reduce(
    (acc, token) => {
      const tokenLower = token.toLowerCase();
      const tfidfScore = searchTokens.reduce((score, searchToken) => {
        const searchTokenLower = searchToken.toLowerCase();
        return score + tfidf(searchTokenLower, tokenLower, allDocuments);
      }, 0);
      acc[tokenLower] = tfidfScore;
      return acc;
    },
    {} as { [key: string]: number },
  );

  const threshold = 0.1;

  return (
    <span>
      {textTokens.map((token, i) => {
        const tokenLower = token.toLowerCase();
        const isImportant = tfidfScores[tokenLower] > threshold;
        return isImportant ? (
          <span key={i} className="font-semibold text-blue-600">
            {token}
          </span>
        ) : (
          token
        );
      })}
    </span>
  );
};

interface Manual {
  processingStatus: string;
  id: string;
  title: string;
  visibilityStatus: STATUS_MANUAL | string;
  author: {
    id: string;
    name: string;
  };
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface SearchResultManual extends Manual {
  matchingSteps: Array<{ description: string }>;
  matchCount: number;
  score: number;
  documentContent: string;
}

function isSearchResultManual(
  manual: Manual | SearchResultManual,
): manual is SearchResultManual {
  return (
    'matchingSteps' in manual &&
    'matchCount' in manual &&
    'score' in manual &&
    'documentContent' in manual
  );
}

interface Step {
  description: string;
}

const tokenizeAndRemoveStopWords = (text: string): string[] => {
  const segmenter = new TinySegmenter();
  const stopwords = [
    'の',
    'に',
    'は',
    'を',
    'た',
    'が',
    'で',
    'て',
    'と',
    'し',
    'れ',
    'さ',
    'だ',
    'き',
    'する',
    'え',
    'み',
    'た',
    'ど',
    'ます',
    '？',
    '！',
    '。',
    '、',
    '，',
    '．',
    '・',
    '／',
    'ある',
    'あり',
    'ん',
    'ませ',
    'が',
    'の',
    'を',
    'に',
    'へ',
    'と',
    'より',
    'から',
    'で',
    'や',
    'ば',
    'とても',
    'でも',
    'から',
    'ので',
    'が',
    'けれど',
    'けれども',
    'のに',
    'て',
    'で',
    'し',
    'ながら',
    'たり',
    'だり',
    'なり',
    'つつ',
    'ものの',
    'ところで',
    'は',
    'も',
    'こそ',
    'さえ',
    'でも',
    'だって',
    'しか',
    'ばかり',
    'など',
    'まで',
    'だけ',
    'ほど',
    'きり',
    'ぎり',
    'くらい',
    'ぐらい',
    'なり',
    'やら',
    'か',
    'だの',
    'なんて',
    'ずつ',
    'とか',
    'すら',
    'な',
    'なあ',
    'や',
    'よ',
    'わ',
    'こと',
    'な',
    'ぞ',
    'ぜ',
    'とも',
    'か',
    'の',
    'ね',
    'ねえ',
    'さ',
    'かしら',
    'もの',
    'ものか',
  ];
  const tokens = segmenter.segment(text);
  return tokens.filter((token) => !stopwords.includes(token) && token.trim() !== '');
};

const termFrequency = (term: string, document: string): number => {
  const terms = document.split(' ');
  const termCount = terms.filter((t) => t === term).length;
  return termCount / terms.length;
};

const inverseDocumentFrequency = (term: string, documents: string[]): number => {
  const numDocumentsWithTerm = documents.filter((doc) => doc.includes(term)).length;
  if (numDocumentsWithTerm > 0) {
    return Math.log(documents.length / numDocumentsWithTerm);
  } else {
    return 0;
  }
};

const tfidf = (term: string, document: string, documents: string[]): number => {
  return termFrequency(term, document) * inverseDocumentFrequency(term, documents);
};

const Manage: React.FC = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<STATUS_MANUAL | string>('');
  const [idManual, setIdManual] = useState('');
  const [title, setTitle] = useState('');
  const [isDialogDelete, setIsDialogDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const organizationId = searchParams.get('id');

  const {
    data: manuals,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['all-manuals', status, organizationId],
    queryFn: () => Manual.getPublicManualsByOrganization(organizationId as string),
    select: (data) => {
      return data.data;
    },
  });

  const stepQueries = useQueries({
    queries: (manuals || []).map((manual: Manual) => ({
      queryKey: ['manual-steps', manual.id],
      queryFn: () => Manual.getManualSteps(manual.id),
      enabled: !!manuals,
    })),
  });

  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || !manuals)
      return (manuals || []).filter(
        (manual: Manual) => manual.visibilityStatus === STATUS_MANUAL.PUBLIC,
      );

    // stepQueriesの結果をマッピング
    const stepQueriesMap: { [key: string]: any } = {};
    (stepQueries || []).forEach((queryResult, index) => {
      stepQueriesMap[manuals[index].id] = queryResult;
    });

    // クエリをトークン化してストップワードを除去
    const queryTokens = tokenizeAndRemoveStopWords(searchTerm);
    const documentContents = manuals.map((manual: Manual) => {
      const steps = stepQueriesMap[manual.id]?.data?.data.data || [];
      return `${manual.title} ${manual.author.name} ${steps.map((step: Step) => step.description).join(' ')}`;
    });

    return manuals
      .filter((manual: Manual) => manual.visibilityStatus === STATUS_MANUAL.PUBLIC)
      .map((manual: Manual) => {
        const stepData = stepQueriesMap[manual.id]?.data?.data.data || [];
        const manualContent = `${manual.title} ${manual.author.name} ${stepData.map((step: Step) => step.description).join(' ') || ''}`;
        const docTokens = tokenizeAndRemoveStopWords(manualContent);
        let score = 0;

        // TF-IDFスコアを計算
        queryTokens.forEach((token) => {
          score += tfidf(token, docTokens.join(' '), documentContents);
        });

        // matchingStepsとmatchCountの計算
        const matchingSteps = stepData.filter((step: Step) =>
          queryTokens.some((token) =>
            step.description.toLowerCase().includes(token.toLowerCase()),
          ),
        );
        const matchCount = matchingSteps.reduce(
          (count: number, step: Step) =>
            count +
            queryTokens.reduce(
              (tokenCount, token) =>
                tokenCount +
                (
                  step.description
                    .toLowerCase()
                    .match(new RegExp(token.toLowerCase(), 'g')) || []
                ).length,
              0,
            ),
          0,
        );

        return {
          ...manual,
          matchingSteps,
          matchCount,
          score,
          documentContent: manualContent,
        } as SearchResultManual;
      })
      .sort((a: SearchResultManual, b: SearchResultManual) => b.score - a.score);
  }, [manuals, searchTerm, stepQueries]);

  const { mutate: delManual } = useMutation({
    mutationFn: (id: string) => Manual.deleteManual(id),
    onSuccess: () => {
      setIsDialogDelete(false);
      refetch();
    },
  });

  const handleDelete = (title: string, id: string) => {
    setTitle(title);
    setIdManual(id);
    setIsDialogDelete(true);
  };
  const handleDialogDelete = () => {
    setIsDialogDelete(false);
  };
  const handleSubmitDel = () => {
    delManual(idManual);
  };

  const handleLink = (url: string) => {
    if (url) {
      navigator.clipboard.writeText(url).then(() =>
        toast(<Notification content="URLをコピーしました" className="max-w-[201px]" />, {
          hideProgressBar: true,
          style: { backgroundColor: 'transparent', boxShadow: 'none' },
          closeButton: false,
          position: 'bottom-right',
          autoClose: 4000,
        }),
      );
    } else return;
  };

  return (
    <div className="flex flex-col items-center ">
      {isLoading && <Progressbar />}
      <div className="my-[32px] w-full px-10 tablet:max-w-[1024px] tablet:px-0">
        <p className="text-left text-2xl font-bold">手順書</p>
        <div className="mb-4 flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="検索キーワードを入力"
            className="flex-grow rounded-l-md border p-2"
          />
        </div>
        <div className="mt-4 overflow-x-auto rounded-3xl bg-white p-5 shadow-form">
          <table className="w-full table-auto ">
            <thead className="text-left text-xs font-bold opacity-40">
              <tr>
                {isLoading ? (
                  <th className="min-w-[200px] p-3 xlpc:min-w-[386px]">
                    <Skeleton className="h-4 w-1/6" />
                  </th>
                ) : (
                  <th className="min-w-[200px] p-3 xlpc:min-w-[386px]">
                    {searchResults?.length || 0}件
                  </th>
                )}

                {/* <th className="min-w-[70px] py-3 xlpc:min-w-[82px]">ステータス</th> */}
                <th className="min-w-[80px]  py-3 xlpc:min-w-[140px]">最終更新日時</th>
                <th className="min-w-[70px]  py-3 xlpc:min-w-[140px]">作成日時</th>
                <th className="min-w-[70px]  py-3 xlpc:min-w-[140px]">作成者</th>
                <th className="min-w-[70px]  py-3 xlpc:min-w-[96px]"></th>
              </tr>
            </thead>
            {isLoading ? (
              <SkeletonManual />
            ) : (
              <tbody>
                {searchResults.map((manual: Manual) => (
                  <React.Fragment key={manual.id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer border-t border-slate-200 text-[14px] text-[#1B2245]"
                      onClick={() => push(`/manual-preview/${manual.id}/detail`)}
                    >
                      <td className="p-3">
                        {isSearchResultManual(manual) ? (
                          highlightImportantText(
                            manual.title,
                            searchTerm,
                            searchResults.map((m: Manual) => {
                              if (isSearchResultManual(m)) {
                                return m.documentContent;
                              }
                              return '';
                            }),
                          )
                        ) : (
                          <span>{(manual as Manual).title}</span>
                        )}
                        {/* {highlightImportantText(manual.title, searchTerm, searchResults.map(m => m.documentContent))} */}
                      </td>
                      {/* <td className="py-3 text-xs font-bold">
                        <div
                          className={clsx(
                            'flex h-[22px] w-[52px] items-center justify-center rounded-3xl text-white',
                            manual.visibilityStatus === STATUS_MANUAL.PUBLIC &&
                              'bg-skyblue',
                            manual.visibilityStatus === STATUS_MANUAL.PRIVATE &&
                              'bg-[#BABDC8]',
                          )}
                        >
                          {manual.visibilityStatus === STATUS_MANUAL.PUBLIC
                            ? STATUS_MANUAL_JP.PUBLIC
                            : STATUS_MANUAL_JP.PRIVATE}
                        </div>
                      </td> */}
                      <td className="py-3">{manual.updatedAt}</td>
                      <td className="py-3">{manual.createdAt}</td>
                      <td className="py-3">{manual.author.name}</td>
                      <td className="p-3" style={{ verticalAlign: 'middle' }}>
                        <div className="flex items-center gap-8">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLink(manual.url);
                            }}
                            className={clsx(
                              manual.visibilityStatus !== STATUS_MANUAL.PUBLIC &&
                                'opacity-30',
                            )}
                            disabled={manual.visibilityStatus === STATUS_MANUAL.PRIVATE}
                          >
                            <Link />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(manual.title, manual.id);
                            }}
                          >
                            <TrashCan />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isSearchResultManual(manual) &&
                      manual.matchCount > 0 &&
                      manual.matchingSteps.length > 0 && (
                        <tr>
                          <td colSpan={6} className="px-3 pb-3">
                            <div className="mt-2 rounded-md bg-blue-50 p-3 shadow-sm">
                              <div className="mb-2 flex items-center text-sm font-semibold text-blue-700">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                                マッチした手順
                              </div>
                              <ul className="space-y-1">
                                {manual.matchingSteps.map((step, index) => (
                                  <li
                                    key={index}
                                    className="text-gray-700 flex items-start text-sm"
                                  >
                                    <span className="mr-2 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                                      {index + 1}
                                    </span>
                                    {isSearchResultManual(manual) ? (
                                      highlightImportantText(
                                        step.description,
                                        searchTerm,
                                        searchResults.map((m: Manual) => {
                                          if (isSearchResultManual(m)) {
                                            return m.documentContent;
                                          }
                                          return '';
                                        }),
                                      )
                                    ) : (
                                      <span>{(manual as Manual).title}</span>
                                    )}
                                    {/* {highlightImportantText(step.description, searchTerm, searchResults.map(m => m.documentContent))} */}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                ))}
              </tbody>
            )}
          </table>
        </div>
        {/* }) */}
      </div>

      {isDialogDelete && (
        <DialogDeleteManual
          handleShow={handleDialogDelete}
          title={title}
          handleSubmit={handleSubmitDel}
        />
      )}
    </div>
  );
};

export default Manage;
