import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Benefits from '../components/Home/Benefits';
import Description from '../components/Home/Description';
import Features from '../components/Home/Features';
import Hero from '../components/Home/Hero';
import Process from '../components/Home/Process';
import { reactQueryKeys } from '../config/reactQueryKeys';
import { getCurrentUser } from '../network/lib/users';
import { getEducations } from '../network/lib/education';
import { getExperiences } from '../network/lib/experience';
import {
  getInterestedUniversities,
  getPublicUniversities,
  getUniversities,
} from '../network/lib/universities';
import Session from 'supertokens-auth-react/recipe/session';
import { useQueryClient } from '@tanstack/react-query';

export default function Home() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // For Google login
  useEffect(() => {
    if (localStorage.getItem('lang') !== router.locale) {
      router.push(router.asPath, undefined, {
        locale: localStorage.getItem('lang'),
      });
    }
  });
  // End for Google login

  useEffect(() => {
    // prefetch data for the current users
    const dummySearchTerm = JSON.stringify({
      searchNameOrCity: '',
      selectedState: 'all',
      selectedConference: 'all',
      selectedDivision: 'all',
      selectedRegion: 'all',
      selectedCategory: 'all',
    });
    const prefetchQueries = async () => {
      try {
        if (!(await Session.doesSessionExist())) {
          await queryClient.prefetchQuery(
            [reactQueryKeys.universities, false, dummySearchTerm],
            () => getPublicUniversities(24, new AbortController())
          );
        } else {
          const prefetchQueryPromises = [
            [
              [reactQueryKeys.currentUser],
              async () => {
                queryClient.prefetchQuery([reactQueryKeys.currentUser], () =>
                  getCurrentUser(new AbortController())
                );
              },
            ],
            [
              [reactQueryKeys.educations],
              async () => {
                queryClient.prefetchQuery([reactQueryKeys.educations], () =>
                  getEducations(new AbortController())
                );
              },
            ],
            [
              [reactQueryKeys.experiences],
              async () => {
                queryClient.prefetchQuery([reactQueryKeys.experiences], () =>
                  getExperiences(new AbortController())
                );
              },
            ],
            [
              [reactQueryKeys.universities, true, dummySearchTerm],
              async () => {
                queryClient.prefetchQuery(
                  [reactQueryKeys.universities, true, dummySearchTerm],
                  () => getUniversities(24, new AbortController())
                );
              },
            ],
            [
              [reactQueryKeys.universities, false, dummySearchTerm],
              async () => {
                queryClient.prefetchQuery(
                  [reactQueryKeys.universities, false, dummySearchTerm],
                  () => getInterestedUniversities(24, new AbortController())
                );
              },
            ],
          ].map((prefetchQueryCandidate) => {
            const prefetchQueryKey = prefetchQueryCandidate[0];
            const prefetchQueryFunction = prefetchQueryCandidate[1];
            if (!queryClient.getQueryData(prefetchQueryKey)) {
              return prefetchQueryFunction;
            }
            return false;
          });
          console.log(prefetchQueryPromises);
          // execute in parallel
          await Promise.all(
            prefetchQueryPromises.map((prefetchQueryPromise) => {
              if (prefetchQueryPromise) prefetchQueryPromise();
            })
          );
        }
      } catch (error) {
        console.log(error); // we admit that there is an error but it's ok
      }
    };
    prefetchQueries();
  }, [queryClient]);

  return (
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl min-h-[80vh]">
      <Hero />
      <Features />
      <Benefits />
      <Process />
      <Description />
    </div>
  );
}
