import '@testing-library/jest-dom'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardList from '../../renderer/components/CardList/CardList'
import {
  renderWithProviders,
  createMockCueCards,
  createMockCueCard
} from '../utils/testUtils'
import { StudyStatus } from '../../redux/cueCards'

// Mock react-router-dom navigation
const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}))

jest.mock('ag-grid-react', () => ({
  AgGridReact: ({
    onRowSelected,
    rowData
  }: {
    onRowSelected?: (event: {
      data: { id: string; question: string; answer: string; score: string }
    }) => void
    rowData?: { id: string; question: string; answer: string; score: string }[]
  }) => {
    // Simulate basic grid functionality
    const data = rowData || []
    return (
      <div data-testid="ag-grid">
        {data.map((card, index: number) => (
          <div
            key={card.id}
            data-testid={`grid-row-${index}`}
            onClick={() => onRowSelected?.({ data: card })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onRowSelected?.({ data: card })
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span data-testid={`question-${index}`}>{card.question}</span>
            <span data-testid={`answer-${index}`}>{card.answer}</span>
            <span data-testid={`score-${index}`}>{card.score}</span>
          </div>
        ))}
      </div>
    )
  }
}))

describe('CardList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    renderWithProviders(<CardList />)
    expect(screen.getByTestId('ag-grid')).toBeInTheDocument()
  })

  it('should display cue cards with calculated scores', () => {
    const mockCards = createMockCueCards(2)
    mockCards[0].history = 'YYN' // 66%
    mockCards[1].history = 'YYYY' // 100%

    renderWithProviders(<CardList />, {
      initialState: { cueCards: mockCards }
    })

    expect(screen.getByTestId('question-0')).toHaveTextContent(
      mockCards[0].question
    )
    expect(screen.getByTestId('answer-0')).toHaveTextContent(
      mockCards[0].answer
    )
    expect(screen.getByTestId('score-0')).toHaveTextContent('66%')

    expect(screen.getByTestId('question-1')).toHaveTextContent(
      mockCards[1].question
    )
    expect(screen.getByTestId('answer-1')).toHaveTextContent(
      mockCards[1].answer
    )
    expect(screen.getByTestId('score-1')).toHaveTextContent('100%')
  })

  it('should display empty scores for cards with no history', () => {
    const mockCards = createMockCueCards(1)
    mockCards[0].history = ''

    renderWithProviders(<CardList />, {
      initialState: { cueCards: mockCards }
    })

    expect(screen.getByTestId('score-0')).toHaveTextContent('')
  })

  it('should render action buttons', () => {
    renderWithProviders(<CardList />)

    expect(
      screen.getByRole('button', { name: /new card/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /edit card/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /delete card/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /study/i })).toBeInTheDocument()
  })

  it('should navigate to AddCard route when New Card button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CardList />)

    const newCardButton = screen.getByRole('button', { name: /new card/i })
    await user.click(newCardButton)

    expect(mockNavigate).toHaveBeenCalledWith('/AddCard')
  })

  it('should disable Edit and Delete buttons when no card is selected', () => {
    renderWithProviders(<CardList />)

    expect(screen.getByRole('button', { name: /edit card/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /delete card/i })).toBeDisabled()
  })

  it('should enable Edit and Delete buttons when card is selected', async () => {
    const mockCards = createMockCueCards(1)
    renderWithProviders(<CardList />, {
      initialState: { cueCards: mockCards }
    })

    // Simulate row selection
    const row = screen.getByTestId('grid-row-0')
    fireEvent.click(row)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /edit card/i })
      ).not.toBeDisabled()
      expect(
        screen.getByRole('button', { name: /delete card/i })
      ).not.toBeDisabled()
    })
  })

  it('should navigate to EditCard route with selected card ID when Edit button is clicked', async () => {
    const user = userEvent.setup()
    const mockCards = createMockCueCards(1)

    renderWithProviders(<CardList />, {
      initialState: { cueCards: mockCards }
    })

    // Select a row first
    const row = screen.getByTestId('grid-row-0')
    fireEvent.click(row)

    const editButton = screen.getByRole('button', { name: /edit card/i })

    await waitFor(() => {
      expect(editButton).not.toBeDisabled()
    })

    await user.click(editButton)

    expect(mockNavigate).toHaveBeenCalledWith('/EditCard', {
      state: { selectedRowId: mockCards[0].id }
    })
  })

  it('should disable Study button when no cards are available', () => {
    renderWithProviders(<CardList />, {
      initialState: { cueCards: [] }
    })

    expect(screen.getByRole('button', { name: /study/i })).toBeDisabled()
  })

  it('should enable Study button when cards are available', () => {
    const mockCards = createMockCueCards(1)
    renderWithProviders(<CardList />, {
      initialState: { cueCards: mockCards }
    })

    expect(screen.getByRole('button', { name: /study/i })).not.toBeDisabled()
  })

  it('should start studying and navigate to Study route when Study button is clicked', async () => {
    const user = userEvent.setup()
    const mockCards = createMockCueCards(2)

    const { store } = renderWithProviders(<CardList />, {
      initialState: { cueCards: mockCards }
    })

    const studyButton = screen.getByRole('button', { name: /study/i })
    await user.click(studyButton)

    // Check that study was started in Redux store
    const state = store.getState()
    expect(state.cueCards.studyMode).toBe(StudyStatus.Question)
    expect(state.cueCards.studyCueCardIndex).toBe(0)

    // Check navigation
    expect(mockNavigate).toHaveBeenCalledWith('/Study')
  })

  it('should delete selected card when Delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockCards = createMockCueCards(2)

    const { store } = renderWithProviders(<CardList />, {
      initialState: { cueCards: mockCards }
    })

    // Select a row first
    const row = screen.getByTestId('grid-row-0')
    fireEvent.click(row)

    const deleteButton = screen.getByRole('button', { name: /delete card/i })

    await waitFor(() => {
      expect(deleteButton).not.toBeDisabled()
    })

    await user.click(deleteButton)

    // Check that card was deleted from store
    const state = store.getState()
    expect(state.cueCards.cueCards).toHaveLength(1)
    expect(state.cueCards.cueCards[0].id).toBe(mockCards[1].id)
  })

  it('should display correct scores based on card history', () => {
    const mockCards = [
      createMockCueCard({ id: 'card-1', history: 'YN' }), // 50%
      createMockCueCard({ id: 'card-2', history: 'YYY' }) // 100%
    ]

    renderWithProviders(<CardList />, {
      initialState: { cueCards: mockCards }
    })

    expect(screen.getByTestId('score-0')).toHaveTextContent('50%')
    expect(screen.getByTestId('score-1')).toHaveTextContent('100%')
  })

  it('should handle empty cue cards list', () => {
    renderWithProviders(<CardList />, {
      initialState: { cueCards: [] }
    })

    expect(screen.getByTestId('ag-grid')).toBeInTheDocument()
    expect(screen.queryByTestId('grid-row-0')).not.toBeInTheDocument()
  })
})
