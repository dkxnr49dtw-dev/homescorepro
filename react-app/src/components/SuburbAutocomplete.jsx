import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '../hooks/useDebounce'
import './SuburbAutocomplete.css'

// Cache for suburbs data
let suburbsCache = null

/**
 * Load suburbs data from CSV
 * @returns {Promise<Array>} Array of suburb objects
 */
async function loadSuburbs() {
  if (suburbsCache) return suburbsCache
  
  try {
    const response = await fetch('/data/suburbs.csv')
    const text = await response.text()
    
    const lines = text.split('\n').slice(1) // Skip header
    suburbsCache = lines
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split(',')
        const suburb = parts[0]?.trim() || ''
        const postcode = parts[1]?.trim() || ''
        const lga = parts[2]?.trim() || ''
        const category = parts[parts.length - 1]?.trim() || 'UNKNOWN'
        
        return { suburb, postcode, lga, category }
      })
      .filter(item => item.suburb) // Filter out empty entries
    
    return suburbsCache
  } catch (error) {
    console.error('Error loading suburbs:', error)
    return []
  }
}

/**
 * SuburbAutocomplete Component
 * A fully accessible autocomplete search for Melbourne suburbs
 */
export function SuburbAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Search suburbs...',
  label = 'Suburb',
  error,
  disabled = false,
  showHint = true
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [suburbs, setSuburbs] = useState([])
  
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const containerRef = useRef(null)
  
  const debouncedValue = useDebounce(value, 150)
  
  // Load suburbs on mount
  useEffect(() => {
    loadSuburbs().then(setSuburbs)
  }, [])
  
  // Search when value changes
  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }
    
    setLoading(true)
    
    const query = debouncedValue.toLowerCase()
    const filtered = suburbs.filter(item => 
      item.suburb.toLowerCase().includes(query) ||
      item.postcode.includes(query) ||
      item.lga?.toLowerCase().includes(query)
    )
    
    // Sort by relevance (exact matches first, then starts with, then contains)
    const sorted = filtered.sort((a, b) => {
      const aLower = a.suburb.toLowerCase()
      const bLower = b.suburb.toLowerCase()
      
      // Exact match
      if (aLower === query) return -1
      if (bLower === query) return 1
      
      // Starts with
      if (aLower.startsWith(query) && !bLower.startsWith(query)) return -1
      if (bLower.startsWith(query) && !aLower.startsWith(query)) return 1
      
      // Alphabetical
      return aLower.localeCompare(bLower)
    })
    
    setResults(sorted.slice(0, 20)) // Limit to 20 results
    setIsOpen(sorted.length > 0)
    setHighlightedIndex(-1)
    setLoading(false)
  }, [debouncedValue, suburbs])
  
  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && results.length > 0) {
        setIsOpen(true)
        setHighlightedIndex(0)
      }
      return
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
        
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
        
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex])
        }
        break
        
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.focus()
        break
        
      case 'Tab':
        setIsOpen(false)
        break
        
      default:
        break
    }
  }, [isOpen, results, highlightedIndex])
  
  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]')
      items[highlightedIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])
  
  const handleSelect = (item) => {
    onChange(item.suburb)
    onSelect?.(item)
    setIsOpen(false)
    setResults([])
    inputRef.current?.focus()
  }
  
  const handleInputChange = (e) => {
    onChange(e.target.value)
  }
  
  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true)
    }
  }
  
  // Group results by category
  const groupedResults = results.reduce((acc, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})
  
  // Generate unique ID
  const id = useRef(`suburb-autocomplete-${Math.random().toString(36).substr(2, 9)}`).current
  
  return (
    <div 
      ref={containerRef}
      className="suburb-autocomplete"
    >
      <label htmlFor={id} className="form-label">
        <span className="form-label-icon" aria-hidden="true">🗺️</span>
        {label}
      </label>
      
      <div className="suburb-autocomplete__input-wrapper">
        <input
          ref={inputRef}
          id={id}
          type="text"
          className={`form-input suburb-autocomplete__input ${error ? 'form-input--error' : ''}`}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined
          }
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? 'true' : undefined}
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="suburb-autocomplete__loading" aria-hidden="true">
            <span className="spinner" />
          </div>
        )}
        
        {/* Clear button */}
        {value && !loading && (
          <button
            type="button"
            className="suburb-autocomplete__clear"
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
      
      {/* Results dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={listRef}
            id={`${id}-listbox`}
            className="suburb-autocomplete__dropdown"
            role="listbox"
            aria-label="Suburb suggestions"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className="suburb-autocomplete__group">
                <div className="suburb-autocomplete__group-label">
                  {category.replace(/_/g, ' ')}
                </div>
                {items.map((item) => {
                  const flatIndex = results.indexOf(item)
                  return (
                    <div
                      key={`${item.suburb}-${item.postcode}`}
                      id={`${id}-option-${flatIndex}`}
                      className={`suburb-autocomplete__option ${
                        flatIndex === highlightedIndex ? 'suburb-autocomplete__option--highlighted' : ''
                      }`}
                      role="option"
                      aria-selected={flatIndex === highlightedIndex}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setHighlightedIndex(flatIndex)}
                    >
                      <div className="suburb-autocomplete__option-main">
                        <span className="suburb-autocomplete__option-name">
                          {highlightQuery(item.suburb, value)}
                        </span>
                        <span className="suburb-autocomplete__option-postcode">
                          {item.postcode}
                        </span>
                      </div>
                      {item.lga && (
                        <div className="suburb-autocomplete__option-lga">
                          {item.lga}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
            
            {results.length === 0 && !loading && (
              <div className="suburb-autocomplete__no-results">
                No suburbs found matching "{value}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error message */}
      {error && (
        <p id={`${id}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
      
      {/* Hint */}
      {showHint && (
        <p className="form-hint">
          Search by suburb name, postcode, or local government area
        </p>
      )}
    </div>
  )
}

/**
 * Helper to highlight matching text in search results
 * @param {string} text - The text to highlight
 * @param {string} query - The search query
 * @returns {JSX.Element} Text with highlighted matches
 */
function highlightQuery(text, query) {
  if (!query) return text
  
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return text
  
  return (
    <>
      {text.slice(0, index)}
      <mark className="suburb-autocomplete__highlight">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}

export default SuburbAutocomplete
