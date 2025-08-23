import '@testing-library/jest-dom'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'
import EditCard from '../../renderer/components/EditCard/EditCard'
import { renderWithProviders, createMockCueCard } from '../utils/testUtils'

// Get reference to the mocked toast

// Mock react-router
const mockNavigate = jest.fn()
const mockLocation = { state: null as { selectedRowId?: string } | null }

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}))

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}))
const mockToast = toast as jest.Mocked<typeof toast>

describe('EditCard Component', () => {
  // NOTE: Some tests are skipped due to issues with form input simulation
  // in the test environment. The controlled textarea components (using useFormInput hook)
  // don't respond properly to user.type() or fireEvent.change() events.
  // This appears to be a testing environment issue, not an application bug.

  beforeEach(() => {
    jest.clearAllMocks()
    mockLocation.state = null
  })

  it('should render form fields', () => {
    renderWithProviders(<EditCard />, { withRouter: true })

    const questionElement = document.getElementById('question')
    const answerElement = document.getElementById('answer')
    expect(questionElement).toBeInTheDocument()
    expect(answerElement).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add another card/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /finished/i })
    ).toBeInTheDocument()
  })

  it('should render empty fields when adding new card', () => {
    renderWithProviders(<EditCard />, { withRouter: true })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const answerField = document.getElementById('answer') as HTMLTextAreaElement

    expect(questionField.value).toBe('')
    expect(answerField.value).toBe('')
  })

  it('should populate fields when editing existing card', () => {
    const mockCard = createMockCueCard({
      question: 'Test Question',
      answer: 'Test Answer'
    })

    mockLocation.state = { selectedRowId: mockCard.id }

    renderWithProviders(<EditCard />, {
      initialState: { cueCards: [mockCard] }
    })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const answerField = document.getElementById('answer') as HTMLTextAreaElement

    expect(questionField.value).toBe(mockCard.question)
    expect(answerField.value).toBe(mockCard.answer)
  })

  it('should show validation error when question is empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EditCard />, { withRouter: true })

    const answerField = document.getElementById('answer') as HTMLTextAreaElement
    const finishedButton = screen.getByRole('button', { name: /finished/i })

    await user.type(answerField, 'Valid answer')
    await user.click(finishedButton)

    expect(mockToast.error).toHaveBeenCalledWith(
      'Please enter text for the question.',
      expect.any(Object)
    )
  })

  it('should show validation error when answer is empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EditCard />, { withRouter: true })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const finishedButton = screen.getByRole('button', { name: /finished/i })

    await user.type(questionField, 'Valid question')
    await user.click(finishedButton)

    expect(mockToast.error).toHaveBeenCalledWith(
      'Please enter text for the answer.',
      expect.any(Object)
    )
  })

  it('should show validation error when both fields are empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EditCard />, { withRouter: true })

    const finishedButton = screen.getByRole('button', { name: /finished/i })
    await user.click(finishedButton)

    expect(mockToast.error).toHaveBeenCalledWith(
      'Please enter text for the question.',
      expect.any(Object)
    )
  })

  it('should create new card when valid input is provided', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<EditCard />, { withRouter: true })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const answerField = document.getElementById('answer') as HTMLTextAreaElement
    const finishedButton = screen.getByRole('button', { name: /finished/i })

    // Set values in fields using fireEvent
    fireEvent.change(questionField, { target: { value: 'New question' } })
    fireEvent.change(answerField, { target: { value: 'New answer' } })

    // Force a rerender to ensure state is updated
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Verify fields have content before clicking button
    expect(questionField.value).toBe('New question')
    expect(answerField.value).toBe('New answer')

    await user.click(finishedButton)

    const state = store.getState()
    expect(state.cueCards.cueCards).toHaveLength(1)
    expect(state.cueCards.cueCards[0].question).toBe('New question')
    expect(state.cueCards.cueCards[0].answer).toBe('New answer')
    expect(state.cueCards.isDirty).toBe(true)
  })

  // TODO: Fix form input simulation - navigation not triggered due to empty form fields
  it('should navigate to home after creating new card', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EditCard />, { withRouter: true })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const answerField = document.getElementById('answer') as HTMLTextAreaElement
    const finishedButton = screen.getByRole('button', { name: /finished/i })

    await user.type(questionField, 'New question')
    await user.type(answerField, 'New answer')
    await user.click(finishedButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  // TODO: Fix form input simulation - navigation not triggered due to empty form fields
  it('should navigate to AddCard route when Add Another Card is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EditCard />, { withRouter: true })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const answerField = document.getElementById('answer') as HTMLTextAreaElement
    const addAnotherButton = screen.getByRole('button', {
      name: /add another card/i
    })

    await user.type(questionField, 'New question')
    await user.type(answerField, 'New answer')
    await user.click(addAnotherButton)

    expect(mockNavigate).toHaveBeenCalledWith('/AddCard')
  })

  // TODO: Fix form input simulation - user.clear() and user.type() not working with controlled components
  it('should update existing card when editing', async () => {
    const user = userEvent.setup()
    const mockCard = createMockCueCard({
      question: 'Original question',
      answer: 'Original answer'
    })

    mockLocation.state = { selectedRowId: mockCard.id }

    const { store } = renderWithProviders(<EditCard />, {
      initialState: { cueCards: [mockCard] },
      withRouter: true
    })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const answerField = document.getElementById('answer') as HTMLTextAreaElement
    const finishedButton = screen.getByRole('button', { name: /finished/i })

    await user.clear(questionField)
    await user.clear(answerField)
    await user.type(questionField, 'Updated question')
    await user.type(answerField, 'Updated answer')
    await user.click(finishedButton)

    const state = store.getState()
    expect(state.cueCards.cueCards).toHaveLength(1)
    expect(state.cueCards.cueCards[0].question).toBe('Updated question')
    expect(state.cueCards.cueCards[0].answer).toBe('Updated answer')
    expect(state.cueCards.cueCards[0].id).toBe(mockCard.id)
    expect(state.cueCards.isDirty).toBe(true)
  })

  it('should handle editing non-existent card', async () => {
    const user = userEvent.setup()
    mockLocation.state = { selectedRowId: 'non-existent-id' }

    renderWithProviders(<EditCard />, {
      initialState: { cueCards: [] },
      withRouter: true
    })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const answerField = document.getElementById('answer') as HTMLTextAreaElement
    const finishedButton = screen.getByRole('button', { name: /finished/i })

    await user.type(questionField, 'Question')
    await user.type(answerField, 'Answer')
    await user.click(finishedButton)

    expect(mockToast.error).toHaveBeenCalledWith(
      'Could not find card to edit.',
      expect.any(Object)
    )
  })

  // TODO: Fix form input simulation - controlled textarea components not responding to simulated input events
  it('should trim whitespace from inputs', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<EditCard />, { withRouter: true })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const answerField = document.getElementById('answer') as HTMLTextAreaElement
    const finishedButton = screen.getByRole('button', { name: /finished/i })

    await user.type(questionField, '  Trimmed question  ')
    await user.type(answerField, '  Trimmed answer  ')
    await user.click(finishedButton)

    const state = store.getState()
    expect(state.cueCards.cueCards[0].question).toBe('Trimmed question')
    expect(state.cueCards.cueCards[0].answer).toBe('Trimmed answer')
  })

  it('should reject whitespace-only inputs', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EditCard />, { withRouter: true })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const answerField = document.getElementById('answer') as HTMLTextAreaElement
    const finishedButton = screen.getByRole('button', { name: /finished/i })

    await user.type(questionField, '   ')
    await user.type(answerField, 'Valid answer')
    await user.click(finishedButton)

    expect(mockToast.error).toHaveBeenCalledWith(
      'Please enter text for the question.',
      expect.any(Object)
    )
  })

  it('should preserve history when editing existing card', async () => {
    const user = userEvent.setup()
    const mockCard = createMockCueCard({
      question: 'Original question',
      answer: 'Original answer',
      history: 'YYN'
    })

    mockLocation.state = { selectedRowId: mockCard.id }

    const { store } = renderWithProviders(<EditCard />, {
      initialState: { cueCards: [mockCard] },
      withRouter: true
    })

    const questionField = document.getElementById(
      'question'
    ) as HTMLTextAreaElement
    const finishedButton = screen.getByRole('button', { name: /finished/i })

    await user.clear(questionField)
    await user.type(questionField, 'Updated question')
    await user.click(finishedButton)

    const state = store.getState()
    expect(state.cueCards.cueCards[0].history).toBe('YYN')
  })
})
