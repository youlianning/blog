import { usePosts } from "./usePosts"
import { isReactive, reactive, watch } from "vue"
import type { PageData } from "../types"

type PostFilter = (page: PageData) => boolean

export type PaginationOptions = {
  /**
   * Current page
   */
  currentPage?: number

  /**
   * Posts each page
   */
  pagination?: number

  /**
   * Filter by tag path
   */
  tags?: string[]

  /**
   * Filter by category path
   */
  categories?: string[]

  /**
   * @default Sort by date in desc
   */
  sort?: (a: PageData, b: PageData) => number

  /**
   * Custom filter
   */
  filter?: PostFilter
}

type PaginationData = {
  posts: PageData[]
  total: number
}

const trueFn = () => true

/**
 * Post pagination
 * @param options Can be an plain object or an reactive object
 */
export const usePostsPagination = async (
  options: PaginationOptions = {}
): Promise<PaginationData> => {
  const posts = await usePosts()
  const paginationData: PaginationData = reactive({
    posts: [],
    total: posts.length,
  })

  const watchCallback = () => {
    const {
      currentPage = 1,
      pagination = 10,
      tags = [],
      categories = [],
      sort = (a, b) => Date.parse(b.date) - Date.parse(a.date),
      filter = trueFn,
    } = options

    const tagFilter: PostFilter = tags.length
      ? (page) => page.tags.some((a) => tags.includes(a.path))
      : trueFn

    const categoryFilter: PostFilter = categories.length
      ? (page) => page.categories.some((a) => categories.includes(a.path))
      : trueFn

    const filteredPosts = posts
      .filter(filter)
      .filter(tagFilter)
      .filter(categoryFilter)

    const currentPosts = filteredPosts
      .sort(sort)
      .slice((currentPage - 1) * pagination, currentPage * pagination)

    paginationData.total = filteredPosts.length
    paginationData.posts = currentPosts
  }

  if (isReactive(options)) {
    watch(options, watchCallback, { immediate: true })
  } else {
    watchCallback()
  }

  return paginationData
}
